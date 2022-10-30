import {
  AuthInfo,
  Fee,
  TxBody,
  TxRaw,
} from "cosmjs-types/cosmos/tx/v1beta1/tx.js";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys.js";
import { toBase64, fromBase64 } from "@cosmjs/encoding";
import Long from "long";
import { assertIsDeliverTxSuccess } from "@cosmjs/stargate";
import { sleep } from "@cosmjs/utils";
import { multiply, ceil, bignumber } from "mathjs";

export const signAndBroadcast = async (
  signer,
  aminoConfig,
  aminoTypes,
  address,
  messages,
  gas,
  memo,
  gasPrice
) => {
  const fee = getFee(gas, gasPrice);
  const txBody = await sign(
    signer,
    aminoConfig,
    aminoTypes,
    address,
    messages,
    memo,
    fee
  );
  return broadcast(txBody);
};

function calculateFee(gasLimit, gasPrice) {
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
    amount: [coin(amount, denom)],
    gas: gasLimit.toString(),
  };
}

function getFee(gas, gasPrice) {
  if (!gas) gas = 200000;
  return calculateFee(gas, gasPrice || defaultGasPrice);
}

function getAccount(restUrl, address) {
  return axios
    .get(restUrl + "/cosmos/auth/v1beta1/accounts/" + address)
    .then((res) => res.data.account)
    .then((value) => {
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

        const baseAccount =
          value.BaseAccount || value.baseAccount || value.base_account;
        if (baseAccount) {
          value = baseAccount;
        }
      }

      const nestedAccount = value.account;
      if (nestedAccount) {
        value = nestedAccount;
      }

      return value;
    })
    .catch((error) => {
      if (error.response?.status === 404) {
        throw new Error("Account does not exist on chain");
      } else {
        throw error;
      }
    });
}

async function broadcast(txBody) {
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
    } catch {
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
    if (
      message.typeUrl.startsWith("/cosmos.authz") &&
      !aminoConfig.authzAminoSupport
    ) {
      throw new Error("This chain does not support amino signing for authz");
    } else if (
      message.typeUrl.startsWith("/cosmos.feegrant") &&
      !aminoConfig.feegrantAminoSupport
    ) {
      throw new Error("This chain does not support amino signing for feegrant");
    } else if (
      message.typeUrl.startsWith("/cosmos.group") &&
      !aminoConfig.groupAminoSupport
    ) {
      throw new Error("This chain does not support amino signing for group");
    }

    return aminoTypes.toAmino(message);
  });
}

async function sign(
  signer,
  aminoConfig,
  aminoTypes,
  address,
  messages,
  memo,
  fee
) {
  const account = await getAccount(address);
  const { account_number: accountNumber, sequence } = account;
  const txBodyBytes = makeBodyBytes(messages, memo);
  let aminoMsgs;
  try {
    aminoMsgs = convertToAmino(aminoConfig, aminoTypes, messages);
  } catch (e) {}
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
      account,
      {
        amount: signed.fee.amount,
        gasLimit: signed.fee.gas,
      },
      SignMode.SIGN_MODE_LEGACY_AMINO_JSON
    );
    return {
      bodyBytes: makeBodyBytes(messages, signed.memo),
      authInfoBytes: authInfoBytes,
      signatures: [Buffer.from(signature.signature, "base64")],
    };
  } else {
    // Sign using standard protobuf messages
    const authInfoBytes = await makeAuthInfoBytes(
      account,
      {
        amount: fee.amount,
        gasLimit: fee.gas,
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
