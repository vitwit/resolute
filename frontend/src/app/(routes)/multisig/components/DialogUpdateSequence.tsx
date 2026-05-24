import CustomButton from '@/components/common/CustomButton';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const DialogUpdateSequence = ({
  open,
  onClose,
  onUpdateSequence,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onUpdateSequence: () => void;
  loading: boolean;
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
                <div className="text-h2 !font-bold">Transaction Sequence Outdated</div>
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
                btnLoading={loading}
                btnStyles="w-full !border-[#D92101] !bg-[#D921011A] delete-multisig-btn"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUpdateSequence;
