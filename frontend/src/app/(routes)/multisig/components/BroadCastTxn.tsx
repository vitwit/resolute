import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setError } from '@/store/features/common/commonSlice';
import {
  resetUpdateTxnState,
  updateTxn,
} from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import { getWalletAmino } from '@/txns/execute';
import { MultisigAccount, Pubkey, Txn } from '@/types/multisig';
import { getAuthToken } from '@/utils/localStorage';
import { NewMultisigThreshoPubkey } from '@/utils/util';
import { SigningStargateClient, makeMultisignedTx } from '@cosmjs/stargate';
import { fromBase64 } from '@cosmjs/encoding';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import React, { useEffect, useState } from 'react';
import { MultisigTxStatus } from '@/types/enums';

interface BroadCastTxnProps {
  txn: Txn;
  multisigAccount: MultisigAccount;
  chainID: string;
}

const BroadCastTxn = ({ txn, multisigAccount, chainID }: BroadCastTxnProps) => {
  const dispatch = useAppDispatch();
  const [load, setLoad] = useState(false);
  const { getChainInfo } = useGetChainInfo();
  const { rpc, address: walletAddress } = getChainInfo(chainID);

  const updateTxnRes = useAppSelector(
    (state: RootState) => state.multisig.updateTxnRes
  );

  useEffect(() => {
    if (updateTxnRes.status === 'rejected') {
      dispatch(
        setError({
          type: 'error',
          message: updateTxnRes?.error || 'something went wrong',
        })
      );
    }
  }, [updateTxnRes]);

  useEffect(() => {
    return () => {
      dispatch(resetUpdateTxnState());
    };
  }, []);

  const broadcastTxn = async () => {
    setLoad(true);
    const authToken = getAuthToken(chainID);
    const queryParams = {
      address: walletAddress,
      signature: authToken?.signature || '',
    };
    try {
      const client = await SigningStargateClient.connect(rpc);

      const multisigAcc = await client.getAccount(
        multisigAccount?.account.address
      );
      if (!multisigAcc) {
        dispatch(
          setError({
            type: 'error',
            message: 'multisig account does not exist on chain',
          })
        );
        setLoad(false);
        return;
      }

      const mapData = multisigAccount.pubkeys || {};
      let pubkeys: Pubkey[] = [];

      mapData.map((p) => {
        const parsed = p?.pubkey;
        const obj = {
          type: parsed?.type,
          value: parsed?.value,
        };
        pubkeys = [...pubkeys, obj];
      });

      const multisigThresholdPK = NewMultisigThreshoPubkey(
        pubkeys,
        `${multisigAccount?.account?.threshold}`
      );

      const txBody = {
        typeUrl: '/cosmos.tx.v1beta1.TxBody',
        value: {
          messages: txn.messages,
          memo: txn.memo,
        },
      };

      const walletAmino = await getWalletAmino(chainID);
      const offlineClient = await SigningStargateClient.offline(walletAmino[0]);
      const txBodyBytes = offlineClient.registry.encode(txBody);

      const signedTx = makeMultisignedTx(
        multisigThresholdPK,
        multisigAcc.sequence,
        txn?.fee,
        txBodyBytes,
        new Map(
          txn?.signatures.map((s) => [s.address, fromBase64(s.signature)])
        )
      );

      const result = await client.broadcastTx(
        Uint8Array.from(TxRaw.encode(signedTx).finish())
      );

      setLoad(false);
      if (result.code === 0) {
        dispatch(
          updateTxn({
            queryParams: queryParams,
            data: {
              txId: txn?.id,
              address: multisigAccount?.account.address,
              body: {
                status: MultisigTxStatus.SUCCESS,
                hash: result?.transactionHash || '',
                error_message: '',
              },
            },
          })
        );
      } else {
        dispatch(
          setError({
            type: 'error',
            message: result?.rawLog || 'Failed to broadcast transaction',
          })
        );
        dispatch(
          updateTxn({
            queryParams: queryParams,
            data: {
              txId: txn.id,
              address: multisigAccount?.account.address,
              body: {
                status: MultisigTxStatus.FAILED,
                hash: result?.transactionHash || '',
                error_message:
                  result?.rawLog || 'Failed to broadcast transaction',
              },
            },
          })
        );
      }
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      setLoad(false);
      dispatch(
        setError({
          type: 'error',
          message: error?.message || 'Failed to broadcast transaction',
        })
      );
      console.log('result');

      dispatch(
        updateTxn({
          queryParams: queryParams,
          data: {
            txId: txn?.id,
            address: multisigAccount?.account.address,
            body: {
              status: MultisigTxStatus.FAILED,
              hash: '',
              error_message:
                error?.message || 'Failed to broadcast transaction',
            },
          },
        })
      );
    }
  };
  return (
    <button
      className="sign-broadcast-btn justify-center flex"
      onClick={() => {
        broadcastTxn();
      }}
    >
      {load ? 'Loading...' : 'Broadcast'}
    </button>
  );
};

export default BroadCastTxn;
