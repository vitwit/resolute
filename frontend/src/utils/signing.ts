import {
  AuthInfo,
  Fee,
  TxBody,
  TxRaw,
} from 'cosmjs-types/cosmos/tx/v1beta1/tx.js';
import { Buffer } from 'buffer';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { PubKey as comsjsPubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys.js';
import { toBase64, fromBase64 } from '@cosmjs/encoding';
import Long from 'long';
import {
  coin,
  defaultRegistryTypes as defaultStargateTypes,
  createBankAminoConverters,
  createDistributionAminoConverters,
  createGovAminoConverters,
  createStakingAminoConverters,
  AminoTypes,
  StdFee,
  GasPrice,
} from '@cosmjs/stargate';
import { sleep } from '@cosmjs/utils';
import { multiply, format, ceil, bignumber, floor } from 'mathjs';
import { AminoMsg, makeSignDoc as makeAminoSignDoc } from '@cosmjs/amino';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing.js';
import {
  isOfflineDirectSigner,
  makeSignDoc,
  OfflineSigner,
  Registry,
} from '@cosmjs/proto-signing';
import { ERR_NO_OFFLINE_AMINO_SIGNER, ERR_UNKNOWN } from './errors';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { GAS_FEE } from './constants';

declare const window: WalletWindow;

const canUseAmino = (aminoConfig: AminoConfig, messages: Msg[]): boolean => {
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (message.typeUrl.startsWith('/cosmos.authz') && !aminoConfig.authz) {
      return false;
    } else if (
      message.typeUrl.startsWith('/cosmos.feegrant') &&
      !aminoConfig.feegrant
    ) {
      return false;
    } else if (
      message.typeUrl.startsWith('/cosmos.group') &&
      !aminoConfig.group
    ) {
      return false;
    }
  }
  return true;
};

const getClient = async (
  aminoConfig: AminoConfig,
  chainId: string,
  messages: Msg[]
): Promise<OfflineSigner> => {
  let signer;

  if (!canUseAmino(aminoConfig, messages)) {
    try {
      await window.wallet.enable(chainId);
      signer = window.wallet.getOfflineSigner(chainId);
    } catch (error) {
      console.log(error);
      throw new Error('failed to get wallet');
    }
  } else {
    try {
      await window.wallet.enable(chainId);
      signer = window.wallet.getOfflineSignerOnlyAmino(chainId);
    } catch (error) {
      console.log(error);
      throw new Error('failed to get wallet');
    }
  }
  return signer;
};

export const signAndBroadcast = async (
  chainId: string,
  aminoConfig: AminoConfig,
  prefix: string,
  messages: Msg[],
  gas: number,
  memo: string,
  gasPrice: string,
  restUrl: string,
  granter?: string
): Promise<ParsedTxResponse> => {
  let signer: OfflineSigner;

  try {
    signer = await getClient(aminoConfig, chainId, messages);
    alert('her....');
    console.log(signer);
  } catch (error) {
    console.log('error while getting client ', error);
    throw new Error('failed to get wallet');
  }

  const accounts = await signer.getAccounts();
  const registry = new Registry(defaultStargateTypes);
  const defaultConverters = {
    ...createBankAminoConverters(),
    ...createDistributionAminoConverters(),
    ...createGovAminoConverters(),
    ...createStakingAminoConverters(),
  };
  let aminoTypes = new AminoTypes(defaultConverters);
  aminoTypes = new AminoTypes({ ...defaultConverters });

  if (!gas) {
    gas = await simulate(
      restUrl,
      registry,
      signer,
      accounts[0].address,
      messages,
      memo,
      1.2,
      gasPrice,
      granter
    );
  }

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

  return await broadcast(txBody, restUrl);
};

function calculateFee(
  gasLimit: number,
  gasPrice: string,
  granter?: string
): StdFee {
  const decodedGasPrice = GasPrice.fromString(gasPrice);
  const processedGasPrice: { amount: number; denom: string } = {
    amount: decodedGasPrice.amount.toFloatApproximation(),
    denom: decodedGasPrice.denom,
  };
  const num1 = multiply(processedGasPrice.amount, gasLimit);
  const num2 = bignumber(num1.toString());
  const amount = ceil(num2);
  return {
    amount: [
      coin(
        format(floor(amount), { notation: 'fixed' }),
        processedGasPrice.denom
      ),
    ],
    gas: gasLimit.toString(),
    granter: granter,
  };
}

function getFee(gas: number, gasPrice: string, granter?: string): StdFee {
  if (!gas) gas = GAS_FEE;
  return calculateFee(gas, gasPrice, granter);
}

async function getAccount(restUrl: string, address: string): Promise<Account> {
  try {
    const res: AxiosResponse<GetAccountResponse> = await axios.get(
      restUrl + '/cosmos/auth/v1beta1/accounts/' + address
    );

    return res.data.account;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      throw new Error('Account does not exist on chain');
    } else {
      console.log(error);
      throw error;
    }
  }
}

async function simulate(
  restUrl: string,
  registry: Registry,
  signer: OfflineSigner,
  address: string,
  messages: Msg[],
  memo: string,
  modifier: number,
  gasPrice: string,
  granter?: string
): Promise<number> {
  const account = await getAccount(restUrl, address);
  const fee = getFee(50_000, gasPrice, granter);
  const amount: Coin[] = fee.amount.map((coin) => {
    return { amount: coin.amount, denom: coin.denom };
  });
  const txBody = {
    bodyBytes: makeBodyBytes(registry, messages, memo),
    authInfoBytes: await makeAuthInfoBytes(
      signer,
      account,
      {
        amount: amount,
        gasLimit: BigInt(fee.gas),
      },
      SignMode.SIGN_MODE_UNSPECIFIED
    ),
    signatures: [new Uint8Array()],
  };

  try {
    const estimate = await axios
      .post(restUrl + '/cosmos/tx/v1beta1/simulate', {
        tx_bytes: toBase64(TxRaw.encode(txBody).finish()),
      })
      .then((el) => el.data.gas_info.gas_used);
    return estimate * modifier;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error(ERR_UNKNOWN);
  }
}

async function broadcast(
  txBody: TxRaw,
  restUrl: string
): Promise<ParsedTxResponse> {
  const timeoutMs = 60_000;
  const pollIntervalMs = 3_000;
  let timedOut = false;
  const txPollTimeout = setTimeout(() => {
    timedOut = true;
  }, timeoutMs);

  const pollForTx = async (txId: string): Promise<ParsedTxResponse> => {
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
        restUrl + '/cosmos/tx/v1beta1/txs/' + txId
      );
      const result = parseTxResult(response.data.tx_response);
      return result;
    } catch (error) {
      console.log('getting txn id error ', error);
      // if transaction index is disabled return txhash
      if (error instanceof AxiosError) {
        if (
          error?.response?.data?.message === 'transaction indexing is disabled'
        ) {
          return {
            code: 0,
            transactionHash: txId,
          };
        }
      }

      return pollForTx(txId);
    }
  };

  const response = await axios.post(restUrl + '/cosmos/tx/v1beta1/txs', {
    tx_bytes: toBase64(TxRaw.encode(txBody).finish()),
    mode: 'BROADCAST_MODE_SYNC',
  });
  console.log('response of the post txn error ', response);
  const result = parseTxResult(response.data.tx_response);
  if (result.code !== 0) return result;
  // have ambiguous issues, todo...
  //assertIsDeliverTxSuccess(result);
  return pollForTx(result.transactionHash).then(
    (value) => {
      clearTimeout(txPollTimeout);
      //assertIsDeliverTxSuccess(value);
      return value;
    },
    (error) => {
      clearTimeout(txPollTimeout);
      return error;
    }
  );
}

function parseTxResult(result: TxResponse): ParsedTxResponse {
  return {
    code: result?.code || 0,
    height: result?.height,
    rawLog: result?.raw_log,
    transactionHash: result?.txhash || '',
    gasUsed: result?.gas_used,
    gasWanted: result?.gas_wanted,
    fee: result?.tx?.auth_info?.fee?.amount,
    time: result?.timestamp,
    memo: result?.tx?.body?.memo,
  };
}

function convertToAmino(
  aminoConfig: AminoConfig,
  aminoTypes: AminoTypes,
  messages: Msg[]
): AminoMsg[] {
  return messages.map((message) => {
    if (message.typeUrl.startsWith('/cosmos.authz') && !aminoConfig.authz) {
      throw new Error('This chain does not support amino signing for authz');
    } else if (
      message.typeUrl.startsWith('/cosmos.feegrant') &&
      !aminoConfig.feegrant
    ) {
      throw new Error('This chain does not support amino signing for feegrant');
    } else if (
      message.typeUrl.startsWith('/cosmos.group') &&
      !aminoConfig.group
    ) {
      throw new Error('This chain does not support amino signing for group');
    }

    return aminoTypes.toAmino(message);
  });
}

async function sign(
  signer: OfflineSigner,
  chainId: string,
  aminoConfig: AminoConfig,
  aminoTypes: AminoTypes,
  address: string,
  messages: Msg[],
  memo: string,
  fee: StdFee,
  restUrl: string,
  registry: Registry
): Promise<{
  bodyBytes: Uint8Array;
  authInfoBytes: Uint8Array;
  signatures: [Uint8Array] | [Buffer];
}> {
  const account = await getAccount(restUrl, address);
  const { account_number, sequence } = account;
  const txBodyBytes = makeBodyBytes(registry, messages, memo);
  let aminoMsgs;
  try {
    aminoMsgs = convertToAmino(aminoConfig, aminoTypes, messages);
  } catch (error) {
    console.log(error);
  }

  // if messages are amino and signer is amino signer
  if (aminoMsgs && !isOfflineDirectSigner(signer)) {
    // Sign as amino if possible for Ledger and wallet support
    const signDoc = makeAminoSignDoc(
      aminoMsgs,
      fee,
      chainId,
      memo,
      account_number,
      sequence
    );
    const { signature, signed } = await signer.signAmino(address, signDoc);
    const amount: Coin[] = signed.fee.amount.map((coin) => {
      return { amount: coin.amount, denom: coin.denom };
    });
    const authInfoBytes = await makeAuthInfoBytes(
      signer,
      account,
      {
        amount: amount,
        gasLimit: BigInt(signed.fee.gas),
        granter: signed.fee.granter,
      },
      SignMode.SIGN_MODE_LEGACY_AMINO_JSON
    );

    return {
      bodyBytes: makeBodyBytes(registry, messages, signed.memo),
      authInfoBytes: authInfoBytes,
      signatures: [Buffer.from(signature.signature, 'base64')],
    };
  }

  // if messages are amino and signer is not amino signer
  if (aminoMsgs) {
    throw new Error(ERR_NO_OFFLINE_AMINO_SIGNER);
  }

  // if the signer is direct signer
  if (isOfflineDirectSigner(signer)) {
    // Sign using standard protobuf messages
    const authInfoBytes = await makeAuthInfoBytes(
      signer,
      account,
      {
        gasLimit: BigInt(fee.gas),
        granter: fee.granter,
      },
      SignMode.SIGN_MODE_DIRECT
    );
    const signDoc = makeSignDoc(
      txBodyBytes,
      authInfoBytes,
      chainId,
      +account_number
    );
    const { signature, signed } = await signer.signDirect(address, signDoc);
    return {
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    };
  }

  // any other case by default
  throw new Error(ERR_UNKNOWN);
}

function makeBodyBytes(
  registry: Registry,
  messages: Msg[],
  memo: string
): Uint8Array {
  const anyMsgs = messages.map((m) => registry.encodeAsAny(m));
  return TxBody.encode(
    TxBody.fromPartial({
      messages: anyMsgs,
      memo: memo,
    })
  ).finish();
}

async function makeAuthInfoBytes(
  signer: OfflineSigner,
  account: Account,
  fee: FeeForAuthInfoBytes,
  mode: SignMode
): Promise<Uint8Array> {
  const { sequence } = account;
  const accountFromSigner = (await signer.getAccounts())[0];
  if (!accountFromSigner) {
    throw new Error('Failed to retrieve account');
  }
  const signerPubkey = accountFromSigner.pubkey;
  return AuthInfo.encode({
    signerInfos: [
      {
        publicKey: {
          typeUrl: pubkeyTypeUrl(account.pub_key),
          value: comsjsPubKey
            .encode({
              key: signerPubkey,
            })
            .finish(),
        },
        sequence: BigInt('' + Long.fromString(sequence, true)),
        modeInfo: { single: { mode: mode } },
      },
    ],
    fee: Fee.fromPartial(fee),
  }).finish();
}

const pubkeyTypeUrl = (pub_key: PubKey, coinType?: number): string => {
  if (pub_key && pub_key['@type']) return pub_key['@type'];

  if (coinType === 60) {
    return '/ethermint.crypto.v1.ethsecp256k1.PubKey';
  }
  return '/cosmos.crypto.secp256k1.PubKey';
};
