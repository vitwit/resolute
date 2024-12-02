import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { setError } from '@/store/features/common/commonSlice';
import {
  broadcastTransaction,
  resetUpdateTxnSequences,
  resetUpdateTxnState,
  setVerifyDialogOpen,
  updateTxnSequences,
} from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import { MultisigAddressPubkey, Txn } from '@/types/multisig';
import React, { useEffect, useState } from 'react';
import {
  CANNOT_BROADCAST_ERROR,
  FAILED_TO_BROADCAST_ERROR,
  FAILED_TO_BROADCAST_TRY_AGAIN,
  FAILED_TO_UPDATE_SEQUENCE,
  UPDATED_SEQUENCE_SUCCESSFULLY,
} from '@/utils/errors';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import CustomButton from '@/components/common/CustomButton';
import { useRouter } from 'next/navigation';
import DialogUpdateSequence from '../DialogUpdateSequence';
import { getAuthToken } from '@/utils/localStorage';
import { COSMOS_CHAIN_ID } from '@/utils/constants';
import { TxStatus } from '@/types/enums';

interface BroadCastTxnProps {
  txn: Txn;
  multisigAddress: string;
  threshold: number;
  pubKeys: MultisigAddressPubkey[];
  chainID: string;
  isMember: boolean;
  isOverview?: boolean;
  broadcastInfo?: {
    disable: boolean;
    isSequenceLess: boolean;
    isSequenceGreater: boolean;
    isSequenceAvailable: boolean;
  };
}

const BroadCastTxn: React.FC<BroadCastTxnProps> = (props) => {
  const {
    txn,
    multisigAddress,
    pubKeys,
    threshold,
    chainID,
    isMember,
    isOverview,
    broadcastInfo,
  } = props;
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const {
    address: walletAddress,
    restURLs: baseURLs,
    rpcURLs,
    chainName,
  } = getChainInfo(chainID);
  const { isAccountVerified } = useVerifyAccount({
    address: walletAddress,
  });
  const router = useRouter();

  const [seqNotSyncOpen, setSeqNotSyncOpen] = useState(false);
  const updateTxnRes = useAppSelector(
    (state: RootState) => state.multisig.updateTxnRes
  );
  const updateTxnSequencesStatus = useAppSelector(
    (state) => state.multisig.updateTxnSequences
  );

  const authToken = getAuthToken(COSMOS_CHAIN_ID);

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
    dispatch(
      broadcastTransaction({
        chainID,
        multisigAddress,
        signedTxn: txn,
        walletAddress,
        threshold,
        pubKeys,
        baseURLs,
        rpcURLs,
      })
    );
  };

  const handleBroadcast = () => {
    if (!isAccountVerified()) {
      dispatch(setVerifyDialogOpen(true));
      return;
    }
    if (isOverview) {
      router.push(`/multisig/${chainName}/${multisigAddress}`);
    } else if (broadcastInfo) {
      if (broadcastInfo.isSequenceLess) {
        setSeqNotSyncOpen(true);
      } else if (broadcastInfo.isSequenceGreater) {
        dispatch(setError({ type: 'error', message: CANNOT_BROADCAST_ERROR }));
      } else if (!broadcastInfo.isSequenceAvailable) {
        // TODO: Sequence number is not available is the txn is signed before adding txn_Sequence into db 
        // This needs to be handled 
        dispatch(
          setError({ type: 'error', message: "Seqeunce not found" })
        );
      } else if (!broadcastInfo.disable) {
        broadcastTxn();
      } else {
        dispatch(
          setError({ type: 'error', message: FAILED_TO_BROADCAST_TRY_AGAIN })
        );
      }
    }
  };

  const handleUpdateSequence = () => {
    dispatch(
      updateTxnSequences({
        data: { address: multisigAddress },
        queryParams: {
          address: walletAddress,
          signature: authToken?.signature || '',
        },
      })
    );
  };

  useEffect(() => {
    if (updateTxnSequencesStatus.status === TxStatus.IDLE) {
      dispatch(
        setError({ type: 'success', message: UPDATED_SEQUENCE_SUCCESSFULLY })
      );
      dispatch(resetUpdateTxnSequences());
      setSeqNotSyncOpen(false);
    }
    if (updateTxnSequencesStatus.status === TxStatus.REJECTED) {
      dispatch(
        setError({
          type: 'error',
          message: updateTxnSequencesStatus?.error || FAILED_TO_UPDATE_SEQUENCE,
        })
      );
    }
  }, [updateTxnSequencesStatus]);

  return (
    <>
      <CustomButton
        btnText="Broadcast"
        btnOnClick={handleBroadcast}
        btnDisabled={!isMember}
        btnStyles="w-[115px]"
      />
      <DialogUpdateSequence
        open={seqNotSyncOpen}
        onClose={() => setSeqNotSyncOpen(false)}
        onUpdateSequence={handleUpdateSequence}
        loading={updateTxnSequencesStatus.status === TxStatus.PENDING}
      />
    </>
  );
};

export default BroadCastTxn;
