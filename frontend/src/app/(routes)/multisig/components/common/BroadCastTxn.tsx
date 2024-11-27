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
import React, { useEffect, useState } from 'react';
import { FAILED_TO_BROADCAST_ERROR } from '@/utils/errors';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import CustomButton from '@/components/common/CustomButton';
import { useRouter } from 'next/navigation';
import CustomDialog from '@/components/common/CustomDialog';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import { DELETE_ILLUSTRATION } from '@/constants/image-names';

interface BroadCastTxnProps {
  txn: Txn;
  multisigAddress: string;
  threshold: number;
  pubKeys: MultisigAddressPubkey[];
  chainID: string;
  isMember: boolean;
  disableBroadcast?: boolean;
  isOverview?: boolean;
  broadcastInfo?: {
    disable: boolean;
    isSequenceLess: boolean;
    isSequenceGreater: boolean;
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
    disableBroadcast,
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
        signedTxn: txn,
        walletAddress,
        threshold,
        pubKeys,
        baseURLs,
        rpcURLs,
      })
    );
  };
  const [pendingSeqOpen, setPendingSeqOpen] = useState(false);
  const [seqNotSyncOpen, setSeqNotSyncOpen] = useState(false);
  const handleBroadcast = () => {
    if (isOverview) {
      router.push(`/multisig/${chainName}/${multisigAddress}`);
    } else if (broadcastInfo) {
      if (broadcastInfo.isSequenceLess) {
        // alert('Sequence is not in sync');
        setSeqNotSyncOpen(true);
      } else if (broadcastInfo.isSequenceGreater) {
        setPendingSeqOpen(true);
        setSeqNotSyncOpen(true);
        // alert(
        //   'There is a transaction that needs to be broadcasted before this'
        // );
      } else if (!broadcastInfo.disable) {
        broadcastTxn();
      }
    }
  };
  return (
    <>
      <CustomButton
        btnText="Broadcast"
        btnOnClick={handleBroadcast}
        btnDisabled={!isMember}
        btnStyles="w-[115px]"
      />
      <DialogSequenceMissMatch
        open={seqNotSyncOpen}
        onClose={() => setSeqNotSyncOpen(false)}
        onUpdateSequence={() => console.log('update')}
      />
    </>
  );
};

export default BroadCastTxn;

const DialogSequenceMissMatch = ({
  open,
  onClose,
  onUpdateSequence,
}: {
  open: boolean;
  onClose: () => void;
  onUpdateSequence: () => void;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      sx={{
        '& .MuiDialog-paper': {
          color: 'white',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: '#1C1C20',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[550px] p-4 relative">
          <button
            className="absolute top-6 right-6 hover:bg-[#ffffff10] w-8 h-8 rounded-full flex items-center justify-center"
            onClick={onClose}
          >
            <Image src="/close.svg" width={20} height={20} alt="close-icon" />
          </button>
          <div className="px-10 py-20 space-y-10">
            <div className="flex flex-col items-center gap-6">
              <div className="border-[4px] bg-[#F3B2AD] border-[#933A42] rounded-full w-16 h-16 mx-auto flex justify-center items-center">
                <div className="p-6 leading-none font-bold text-[48px] text-[#933A42] select-none">
                  !
                </div>
              </div>
              <div className="flex items-center flex-col gap-2">
                <div className="text-h2 !font-bold">Sequence Outdated</div>
                <div className="text-b1-light text-center">
                  Transaction sequence is outdated. To broadcast this
                  transaction, the sequence number needs to be updated.
                </div>
                <div className="text-b1-light text-center">
                  Would you like to update?
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="text-b1-light !font-normal rounded-lg bg-[#ffffff0d] p-2 !text-red-400">
                After this action all the signers will be required to re-sign.
              </div>
              <CustomButton
                btnOnClick={onUpdateSequence}
                btnText="Update Sequence"
                btnStyles="w-full !border-[#D92101] !bg-[#D921011A] delete-multisig-btn"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
