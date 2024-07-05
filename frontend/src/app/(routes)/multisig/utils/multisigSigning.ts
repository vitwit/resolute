import { getWalletAmino } from '@/txns/execute';
import { MultisigAddressPubkey, Pubkey, Txn } from '@/types/multisig';
import { makeMultisignedTx, SigningStargateClient } from '@cosmjs/stargate';
import { toBase64 } from '@cosmjs/encoding';
import { getAuthToken } from '@/utils/localStorage';
import { COSMOS_CHAIN_ID } from '@/utils/constants';
import {
  cleanURL,
  isNetworkError,
  NewMultisigThresholdPubkey,
} from '@/utils/util';
import { fromBase64 } from '@cosmjs/encoding';
import axios from 'axios';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { parseTxResult } from '@/utils/signing';
import { NETWORK_ERROR } from '@/utils/errors';
import multisigService from '@/store/features/multisig/multisigService';

declare let window: WalletWindow;

const signTransaction = async (
  chainID: string,
  multisigAddress: string,
  unSignedTxn: Txn,
  walletAddress: string,
  rpcURLs: string[]
) => {
  try {
    window.wallet.defaultOptions = {
      sign: {
        preferNoSetMemo: true,
        preferNoSetFee: true,
        disableBalanceCheck: true,
      },
    };
    const client = await multisigService.getStargateClient(rpcURLs);

    const result = await getWalletAmino(chainID);
    const wallet = result[0];
    const signingClient = await SigningStargateClient.offline(wallet);

    const multisigAcc = await client.getAccount(multisigAddress);
    if (!multisigAcc) {
      throw new Error('Multisig account does not exist on chain');
    }

    const signerData = {
      accountNumber: multisigAcc?.accountNumber,
      sequence: multisigAcc?.sequence,
      chainId: chainID,
    };

    const msgs = unSignedTxn?.messages || [];

    const { signatures } = await signingClient.sign(
      walletAddress,
      msgs,
      unSignedTxn?.fee || { amount: [], gas: '' },
      unSignedTxn?.memo || '',
      signerData
    );

    const payload = {
      signer: walletAddress,
      txId: unSignedTxn.id || NaN,
      address: multisigAddress,
      signature: toBase64(signatures[0]),
    };

    return payload;
  } catch (error) {
    throw error;
  }
};

export async function broadcastTransaction(data: {
  chainID: string;
  multisigAddress: string;
  signedTxn: Txn;
  walletAddress: string;
  pubKeys: MultisigAddressPubkey[];
  threshold: number;
  baseURLs: string[];
  rpcURLs: string[];
}) {
  const authToken = getAuthToken(COSMOS_CHAIN_ID);
  const queryParams = {
    address: data.walletAddress,
    signature: authToken?.signature || '',
  };

  try {
    const client = await multisigService.getStargateClient(data.rpcURLs);
    const multisigAcc = await client.getAccount(data.multisigAddress);
    if (!multisigAcc) {
      throw new Error('Multisig account does not exist on chain');
    }

    const mapData = data.pubKeys || [];
    let pubkeys_list: Pubkey[] = [];

    pubkeys_list = mapData.map((p) => {
      const parsed = p?.pubkey;
      const obj = {
        type: parsed?.type,
        value: parsed?.value,
      };
      return obj;
    });

    const multisigThresholdPK = NewMultisigThresholdPubkey(
      pubkeys_list,
      `${data.threshold}`
    );

    const txBody = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages: data.signedTxn.messages,
        memo: data.signedTxn.memo,
      },
    };

    const walletAmino = await getWalletAmino(data.chainID);
    const offlineClient = await SigningStargateClient.offline(walletAmino[0]);
    const txBodyBytes = offlineClient.registry.encode(txBody);

    const signedTx = makeMultisignedTx(
      multisigThresholdPK,
      multisigAcc.sequence,
      data.signedTxn?.fee,
      txBodyBytes,
      new Map(
        data.signedTxn?.signatures.map((s) => [
          s.address,
          fromBase64(s.signature),
        ])
      )
    );

    const result = await client.broadcastTx(
      Uint8Array.from(TxRaw.encode(signedTx).finish())
    );
    const txn = await axios.get(
      `${cleanURL(data.baseURLs[0])}/cosmos/tx/v1beta1/txs/${result.transactionHash}`
    );
    const {
      code,
      transactionHash,
      fee = [],
      memo = '',
      rawLog = '',
    } = parseTxResult(txn?.data?.tx_response);

    return { result, code, transactionHash, fee, memo, rawLog, queryParams };
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    let errMsg =
      error?.message || 'Error while signing the transaction, Try again.';
    if (isNetworkError(errMsg)) {
      errMsg = `${NETWORK_ERROR}: ${errMsg}`;
    }
    throw new Error(errMsg);
  }
}

export default {
  signTransaction,
  broadcastTransaction,
};
