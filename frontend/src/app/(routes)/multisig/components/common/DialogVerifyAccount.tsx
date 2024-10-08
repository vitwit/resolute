import { Dialog, DialogContent } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setVerifyDialogOpen } from '@/store/features/multisig/multisigSlice';
import Image from 'next/image';
import CustomButton from '@/components/common/CustomButton';
import { VERIFY_ILLUSTRATION } from '@/constants/image-names';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import { TxStatus } from '@/types/enums';

const DialogVerifyAccount = ({ walletAddress }: { walletAddress: string }) => {
  const dispatch = useAppDispatch();
  const { verifyOwnership } = useVerifyAccount({
    address: walletAddress,
  });

  const open = useAppSelector((state) => state.multisig.verifyDialogOpen);
  const loadingState = useAppSelector(
    (state) => state.multisig.verifyAccountRes.status
  );
  const isLoading = loadingState === TxStatus.PENDING;

  const handleClose = () => {
    dispatch(setVerifyDialogOpen(false));
  };

  const handleVerifyAccountEvent = () => {
    verifyOwnership();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <div className="w-[450px] p-4 relative">
          <button
            className="absolute top-6 right-6 hover:bg-[#ffffff10] w-8 h-8 rounded-full flex items-center justify-center"
            onClick={handleClose}
          >
            <Image src="/close.svg" width={20} height={20} alt="close-icon" />
          </button>
          <div className="px-10 py-20 space-y-10">
            <div className="flex flex-col items-center gap-6">
              <Image
                src={VERIFY_ILLUSTRATION}
                width={60}
                height={60}
                alt="Verify Ownership"
              />
              <div className="flex items-center flex-col gap-2">
                <div className="text-h2 !font-bold">Ownership</div>
                <div className="text-b1-light">
                  Verify your ownership to continue
                </div>
              </div>
            </div>
            <CustomButton
              btnOnClick={handleVerifyAccountEvent}
              btnLoading={isLoading}
              btnDisabled={isLoading}
              btnText="Verify Ownership"
              btnStyles="w-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogVerifyAccount;
