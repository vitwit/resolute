import {
  AuthInfo,
  Fee,
  TxBody,
  TxRaw,
} from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import { Buffer } from "buffer";
import axios from "axios";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys.js";
import { toBase64, fromBase64 } from "@cosmjs/encoding";
import Long from "long";
import {
  assertIsDeliverTxSuccess,
  GasPrice,
  coin,
  defaultRegistryTypes as defaultStargateTypes,
  createBankAminoConverters,
  createDistributionAminoConverters,
  createGovAminoConverters,
  createStakingAminoConverters,
  AminoTypes,
} from "@cosmjs/stargate";
import { sleep } from "@cosmjs/utils";
import { multiply, format, ceil, bignumber, floor } from "mathjs";
import { makeSignDoc as makeAminoSignDoc } from "@cosmjs/amino";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing.js";
import { makeSignDoc, Registry } from "@cosmjs/proto-signing";
import { slashingAminoConverter } from "../features/slashing/slashing";
import { MsgUnjail } from "../txns/slashing/tx";

const canUseAmino = (aminoConfig, messages) => {
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (message.typeUrl.startsWith("/cosmos.authz") && !aminoConfig.authz) {
      return false;
    } else if (
      message.typeUrl.startsWith("/cosmos.feegrant") &&
      !aminoConfig.feegrant
    ) {
      return false;
    } else if (
      message.typeUrl.startsWith("/cosmos.group") &&
      !aminoConfig.group
    ) {
      return false;
    }
  }
  return true;
};

const getKeplrClient = async (aminoConfig, chainId, messages) => {
  let signer;
  if (!canUseAmino(aminoConfig, messages)) {
    try {
      await window.keplr.enable(chainId);
      signer = window.getOfflineSigner(chainId);
    } catch (error) {
      console.log(error);
      throw new Error("failed to get keplr");
    }
  } else {
    try {
      await window.keplr.enable(chainId);
      signer = window.getOfflineSignerOnlyAmino(chainId);
    } catch (error) {
      console.log(error);
      throw new Error("failed to get keplr");
    }
  }

  return signer;
};

export const signAndBroadcast = async (
  chainId,
  aminoConfig,
  prefix,
  messages,
  gas,
  memo,
  gasPrice,
  restUrl,
  granter = undefined
) => {
  let signer;
  try {
    signer = await getKeplrClient(aminoConfig, chainId, messages);
  } catch (error) {
    throw new Error("failed to get keplr");
  }

  const accounts = await signer.getAccounts();
  const registry = new Registry(defaultStargateTypes);
  const defaultConverters = {
    ...slashingAminoConverter(),
    ...createBankAminoConverters(),
    ...createDistributionAminoConverters(),
    ...createGovAminoConverters(),
    ...createStakingAminoConverters(prefix),
  };
  let aminoTypes = new AminoTypes(defaultConverters);
  aminoTypes = new AminoTypes({ ...defaultConverters });

  registry.register("/cosmos.slashing.v1beta1.MsgUnjail", MsgUnjail);

  const fee = getFee(gas, gasPrice, granter);
  const txBody = await sign(
    signer,
    chainId,
    aminoConfig,
    aminoTypes,
    accounts[0].address,
    messages,
    memo,
    fee,
    restUrl,
    registry
  );

  return broadcast(txBody, restUrl);
};

function calculateFee(gasLimit, gasPrice, granter) {
  const processedGasPrice =
    typeof gasPrice === "string" ? GasPrice.fromString(gasPrice) : gasPrice;
  const { denom, amount: gasPriceAmount } = processedGasPrice;
  const amount = ceil(
    bignumber(
      multiply(
        bignumber(gasPriceAmount.toString()),
        bignumber(gasLimit.toString())
      )
    )
  );
  return {
    amount: [coin(format(floor(amount), { notation: "fixed" }), denom)],
    gas: gasLimit.toString(),
    granter: granter,
  };
}

function getFee(gas, gasPrice, granter) {
  if (!gas) gas = 260000;
  return calculateFee(gas, gasPrice, granter);
}

async function getAccount(restUrl, address) {
  let value;
  try {
    const res = await axios.get(
      restUrl + "/cosmos/auth/v1beta1/accounts/" + address
    );
    value = res.data.account;
    const baseAccount =
      value.BaseAccount || value.baseAccount || value.base_account;
    if (baseAccount) {
      value = baseAccount;
    }

    const baseVestingAccount =
      value.BaseVestingAccount ||
      value.baseVestingAccount ||
      value.base_vesting_account;
    if (baseVestingAccount) {
      value = baseVestingAccount;

      const baseAccount_1 =
        value.BaseAccount || value.baseAccount || value.base_account;
      if (baseAccount_1) {
        value = baseAccount_1;
      }
    }

    const nestedAccount = value.account;
    if (nestedAccount) {
      value = nestedAccount;
    }
    return value;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Account does not exist on chain");
    } else {
      console.log(error);
      throw error;
    }
  }
}

async function broadcast(txBody, restUrl) {
  const timeoutMs = 60_000;
  const pollIntervalMs = 3_000;
  let timedOut = false;
  const txPollTimeout = setTimeout(() => {
    timedOut = true;
  }, timeoutMs);

  const pollForTx = async (txId) => {
    if (timedOut) {
      throw new Error(
        `Transaction with ID ${txId} was submitted but was not yet found on the chain. You might want to check later. There was a wait of ${
          timeoutMs / 1000
        } seconds.`
      );
    }
    await sleep(pollIntervalMs);
    try {
      const response = await axios.get(
        restUrl + "/cosmos/tx/v1beta1/txs/" + txId
      );
      const result = parseTxResult(response.data.tx_response);
      return result;
    } catch (error) {
      console.log(error);
      return pollForTx(txId);
    }
  };

  const response = await axios.post(restUrl + "/cosmos/tx/v1beta1/txs", {
    tx_bytes: toBase64(TxRaw.encode(txBody).finish()),
    mode: "BROADCAST_MODE_SYNC",
  });
  const result = parseTxResult(response.data.tx_response);
  assertIsDeliverTxSuccess(result);
  return pollForTx(result.transactionHash).then(
    (value) => {
      clearTimeout(txPollTimeout);
      assertIsDeliverTxSuccess(value);
      return value;
    },
    (error) => {
      clearTimeout(txPollTimeout);
      return error;
    }
  );
}

function parseTxResult(result) {
  return {
    code: result.code,
    height: result.height,
    rawLog: result.raw_log,
    transactionHash: result.txhash,
    gasUsed: result.gas_used,
    gasWanted: result.gas_wanted,
  };
}

function convertToAmino(aminoConfig, aminoTypes, messages) {
  return messages.map((message) => {
    if (message.typeUrl.startsWith("/cosmos.authz") && !aminoConfig.authz) {
      throw new Error("This chain does not support amino signing for authz");
    } else if (
      message.typeUrl.startsWith("/cosmos.feegrant") &&
      !aminoConfig.feegrant
    ) {
      throw new Error("This chain does not support amino signing for feegrant");
    } else if (
      message.typeUrl.startsWith("/cosmos.group") &&
      !aminoConfig.group
    ) {
      throw new Error("This chain does not support amino signing for group");
    }

    return aminoTypes.toAmino(message);
  });
}

async function sign(
  signer,
  chainId,
  aminoConfig,
  aminoTypes,
  address,
  messages,
  memo,
  fee,
  restUrl,
  registry
) {
  const account = await getAccount(restUrl, address);
  const { account_number: accountNumber, sequence } = account;
  const txBodyBytes = makeBodyBytes(registry, messages, memo);
  let aminoMsgs;
  try {
    aminoMsgs = convertToAmino(aminoConfig, aminoTypes, messages);
  } catch (error) {
    console.log(error);
  }

  if (aminoMsgs && signer.signAmino) {
    // Sign as amino if possible for Ledger and Keplr support
    const signDoc = makeAminoSignDoc(
      aminoMsgs,
      fee,
      chainId,
      memo,
      accountNumber,
      sequence
    );
    const { signature, signed } = await signer.signAmino(address, signDoc);
    const authInfoBytes = await makeAuthInfoBytes(
      signer,
      account,
      {
        amount: signed.fee.amount,
        gasLimit: signed.fee.gas,
        granter: signed.fee.granter,
      },
      SignMode.SIGN_MODE_LEGACY_AMINO_JSON
    );

    return {
      bodyBytes: makeBodyBytes(registry, messages, signed.memo),
      authInfoBytes: authInfoBytes,
      signatures: [Buffer.from(signature.signature, "base64")],
    };
  } else {
    // Sign using standard protobuf messages
    const authInfoBytes = await makeAuthInfoBytes(
      signer,
      account,
      {
        amount: fee.amount,
        gasLimit: fee.gas,
        granter: fee.granter,
      },
      SignMode.SIGN_MODE_DIRECT
    );
    const signDoc = makeSignDoc(
      txBodyBytes,
      authInfoBytes,
      chainId,
      accountNumber
    );
    const { signature, signed } = await signer.signDirect(address, signDoc);
    return {
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    };
  }
}

function makeBodyBytes(registry, messages, memo) {
  const anyMsgs = messages.map((m) => registry.encodeAsAny(m));
  return TxBody.encode(
    TxBody.fromPartial({
      messages: anyMsgs,
      memo: memo,
    })
  ).finish();
}

async function makeAuthInfoBytes(signer, account, fee, mode) {
  const { sequence } = account;
  const accountFromSigner = (await signer.getAccounts())[0];
  if (!accountFromSigner) {
    throw new Error("Failed to retrieve account");
  }
  const signerPubkey = accountFromSigner.pubkey;
  return AuthInfo.encode({
    signerInfos: [
      {
        publicKey: {
          typeUrl: pubkeyTypeUrl(account.pub_key),
          value: PubKey.encode({
            key: signerPubkey,
          }).finish(),
        },
        sequence: Long.fromNumber(sequence, true),
        modeInfo: { single: { mode: mode } },
      },
    ],
    fee: Fee.fromPartial(fee),
  }).finish();
}

const pubkeyTypeUrl = (pub_key, coinType) => {
  if (pub_key && pub_key["@type"]) return pub_key["@type"];

  if (coinType === 60) {
    return "/ethermint.crypto.v1.ethsecp256k1.PubKey";
  }
  return "/cosmos.crypto.secp256k1.PubKey";
};
