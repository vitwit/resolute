import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setError } from '@/store/features/common/commonSlice';
import {
  broadcastTransaction,
  resetUpdateTxnState,
  setVerifyDialogOpen,
} from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import { MultisigAddressPubkey, Txn } from '@/types/multisig';
import React, { useEffect } from 'react';
import { FAILED_TO_BROADCAST_ERROR } from '@/utils/errors';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import CustomButton from '@/components/common/CustomButton';

interface BroadCastTxnProps {
  txn: Txn;
  multisigAddress: string;
  threshold: number;
  pubKeys: MultisigAddressPubkey[];
  chainID: string;
  isMember: boolean;
}

const BroadCastTxn: React.FC<BroadCastTxnProps> = (props) => {
  const { txn, multisigAddress, pubKeys, threshold, chainID } = props;
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const {
    rpc,
    address: walletAddress,
    restURLs: baseURLs,
  } = getChainInfo(chainID);
  const { isAccountVerified } = useVerifyAccount({
    address: walletAddress,
  });

  const updateTxnRes = useAppSelector(
    (state: RootState) => state.multisig.updateTxnRes
  );

  useEffect(() => {
    if (updateTxnRes.status === 'rejected') {
      dispatch(
        setError({
          type: 'error',
          message: updateTxnRes?.error || FAILED_TO_BROADCAST_ERROR,
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
    if (!isAccountVerified()) {
      dispatch(setVerifyDialogOpen(true));
      return;
    }
    dispatch(
      broadcastTransaction({
        chainID,
        multisigAddress,
        rpc,
        signedTxn: txn,
        walletAddress,
        threshold,
        pubKeys,
        baseURLs,
      })
    );
  };
  return (
    <CustomButton
      btnText="Broadcast"
      btnOnClick={() => {
        broadcastTxn();
      }}
      btnStyles="w-[115px]"
    />
  );
};

export default BroadCastTxn;
