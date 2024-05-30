import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setError } from '@/store/features/common/commonSlice';
import {
  broadcastTransaction,
  resetUpdateTxnState,
  setVerifyDialogOpen,
  updateTxn,
} from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import { getWalletAmino } from '@/txns/execute';
import { MultisigAddressPubkey, Pubkey, Txn } from '@/types/multisig';
import { getAuthToken } from '@/utils/localStorage';
import { NewMultisigThresholdPubkey } from '@/utils/util';
import { SigningStargateClient, makeMultisignedTx } from '@cosmjs/stargate';
import { fromBase64 } from '@cosmjs/encoding';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import React, { useEffect, useState } from 'react';
import { MultisigTxStatus } from '@/types/enums';
import { FAILED_TO_BROADCAST_ERROR } from '@/utils/errors';
import { CircularProgress } from '@mui/material';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import { COSMOS_CHAIN_ID } from '@/utils/constants';
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
  const { txn, multisigAddress, pubKeys, threshold, chainID, isMember } = props;
  const dispatch = useAppDispatch();
  const [load, setLoad] = useState(false);
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
      btnDisabled={load || !isMember}
      btnLoading={load}
      btnOnClick={() => {
        broadcastTxn();
      }}
      btnStyles="w-[115px]"
    />
  );
};

export default BroadCastTxn;
