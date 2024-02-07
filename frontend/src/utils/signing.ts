import {
  AuthInfo,
  Fee,
  TxBody,
  TxRaw,
} from 'cosmjs-types/cosmos/tx/v1beta1/tx.js';
import { Buffer } from 'buffer';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { PubKey, PubKey as comsjsPubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys.js';
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
import { cancelUnbondingAminoConverter } from '@/store/features/staking/amino';
import { sleep } from '@cosmjs/utils';
import { multiply, format, ceil, bignumber, floor, string } from 'mathjs';
import { AminoMsg, makeSignDoc as makeAminoSignDoc } from '@cosmjs/amino';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing.js';
import {
  isOfflineDirectSigner,
  makeSignDoc,
  OfflineSigner,
  Registry,
} from '@cosmjs/proto-signing';
import {
  ERR_NO_OFFLINE_AMINO_SIGNER,
  ERR_UNKNOWN
} from './errors';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { GAS_FEE, MAX_TRY_END_POINTS } from './constants';
import { MsgCancelUnbondingDelegation } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { CosmjsOfflineSigner } from '@leapwallet/cosmos-snap-provider';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { isMetaMaskWallet } from './localStorage';
import { get } from 'lodash';
import { axiosGetRequestWrapper } from './RequestWrapper';

const ETH_BASE_ACCOUNT_TYPE = '/ethermint.types.v1.EthAccount';
const ETH_CHAIN_ACCOUNT_PREFIXES = 'dym'

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

export const getClient = async (
  aminoConfig: AminoConfig,
  chainId: string,
  messages: Msg[],
  granter?: string
): Promise<OfflineSigner> => {
  let signer;

  if (isMetaMaskWallet()) {
    if (!canUseAmino(aminoConfig, messages)) {
      try {
        await window.wallet.enable(chainId);

        signer = new CosmjsOfflineSigner(chainId);
      } catch (error) {
        console.log(error);
        throw new Error('failed to get wallet');
      }
    } else {
      try {
        await window.wallet.enable(chainId);
        signer = new CosmjsOfflineSigner(chainId);
      } catch (error) {
        console.log(error);
        throw new Error('failed to get wallet');
      }
    }
  } else {
    if (granter) {
      try {
        await window.wallet.enable(chainId);
        signer = window.wallet.getOfflineSigner(chainId);
      } catch (error) {
        console.log(error);
        throw new Error('failed to get wallet');
      }
    } else if (!canUseAmino(aminoConfig, messages)) {
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
  granter?: string,
  rpc?: string,
  restURLs?: Array<string>
): Promise<ParsedTxResponse> => {
  let signer: OfflineSigner;
  let client: SigningCosmWasmClient;

  try {
    if (isMetaMaskWallet()) {
      signer = await getClient(aminoConfig, chainId, messages);
    } else {
      signer = await getClient(aminoConfig, chainId, messages, granter);
    }


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
    ...cancelUnbondingAminoConverter(),
  };
  registry.register(
    '/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation',
    MsgCancelUnbondingDelegation
  );
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

  if (isMetaMaskWallet()) {
    try {
      const offlineSigner = new CosmjsOfflineSigner(chainId);
      const rpcEndpoint = rpc || ''
      try {
        client = await SigningCosmWasmClient.connectWithSigner(
          rpcEndpoint,
          offlineSigner
        );

        const result = await client.signAndBroadcast(accounts[0].address, messages, fee, memo);

        const parseResult = parseTxResult({
          code: result?.code,
          codespace: '',
          data: '',
          events: [],
          gas_used: String(result?.gasUsed),
          gas_wanted: String(result?.gasWanted),
          height: String(result?.height),
          info: '',
          logs: [],
          timestamp: '',
          raw_log: '',
          txhash: result?.transactionHash
        })

        return Promise.resolve(parseResult)
      }
      /* eslint-disable @typescript-eslint/no-explicit-any */
      catch (error: any) {
        console.log('error connect with signer', error)
        throw error?.message
      }
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    catch (error: any) {
      console.log('error in sign and broadcast', error)
      throw error?.message
    }
  } else {
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

    return await broadcast(txBody, restUrl, restURLs);
  }

  // return Promise.resolve(parseTxResult({
  //   code: 0,
  //   codespace: '',
  //   data: '',
  //   events: [],
  //   gas_used: '',
  //   gas_wanted: '',
  //   height: '',
  //   info: '',
  //   logs: [],
  //   timestamp: '',
  //   raw_log: '',
  //   txhash: ''
  // }))
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

  let num1;
  if (isMetaMaskWallet()) {
    num1 = multiply(processedGasPrice.amount, 1.2)
    if (ceil(num1) <= 1) {
      num1 = multiply(processedGasPrice.amount, gasLimit)
    }
  } else {
    num1 = multiply(processedGasPrice.amount, gasLimit);
  }

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
  restUrl: string,
  restURLs?: Array<string>
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
        `Transaction with ID ${txId} was submitted but was not yet found on the chain. You might want to check later. There was a wait of ${timeoutMs / 1000
        } seconds.`
      );

      clearTimeout(txPollTimeout);
    }
    await sleep(pollIntervalMs);
    try {
      if (restURLs?.length) {
        const response = await axiosGetRequestWrapper(restURLs, `/cosmos/tx/v1beta1/txs/${txId}`, MAX_TRY_END_POINTS)
        const result = parseTxResult(response.data.tx_response);
        return result;
      } else {
        const response = await axios.get(
          restUrl + '/cosmos/tx/v1beta1/txs/' + txId
        );
        const result = parseTxResult(response.data.tx_response);
        return result;
      }
    } catch (error) {
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
  console.log('response of the post txn ', response);
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

export function parseTxResult(result: TxResponse): ParsedTxResponse {
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
  let account = await getAccount(restUrl, address);

  if (get(account, '@type') === ETH_BASE_ACCOUNT_TYPE)
    account = {
      '@type': get(account, '@type') || '',
      'address': get(account, 'base_account.address') || '',
      'account_number': get(account, 'base_account.account_number') || '',
      pub_key: get(account, 'base_account.pub_key'),
      sequence: get(account, 'base_account.sequence') || ''
    }

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

    try {
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
    } catch (error) {
      console.log('error while make auth info bytes', error)
      throw new Error('Request rejected');
    }

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

    try {
      const { signature, signed } = await signer.signDirect(address, signDoc);

      return {
        bodyBytes: signed.bodyBytes,
        authInfoBytes: signed.authInfoBytes,
        signatures: [fromBase64(signature.signature)],
      };

    } catch (error) {
      console.log('error while sign direct', error)
      throw new Error('Request rejected');
    }

  }

  // if messages are amino and signer is not amino signer
  if (aminoMsgs) {
    throw new Error(ERR_NO_OFFLINE_AMINO_SIGNER);
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
          typeUrl: pubkeyTypeUrl(account?.pub_key,
            account.address.includes(ETH_CHAIN_ACCOUNT_PREFIXES) ? 60 : undefined),
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

const pubkeyTypeUrl = (pub_key?: globalThis.PubKey, coinType?: number): string => {
  if (pub_key && pub_key['@type']) return pub_key['@type'];

  if (coinType === 60) {
    return '/ethermint.crypto.v1.ethsecp256k1.PubKey';
  }
  return '/cosmos.crypto.secp256k1.PubKey';
};
