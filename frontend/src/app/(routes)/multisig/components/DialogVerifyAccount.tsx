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
        <div className="w-[550px] p-4">
          <div className="px-10 py-20 space-y-10">
            <div className="flex flex-col items-center gap-6">
              <Image
                src={VERIFY_ILLUSTRATION}
                width={150}
                height={150}
                alt="Verify Ownership"
              />
              <div className="flex items-center flex-col gap-2">
                <div className="text-h1 !font-semibold">Ownership</div>
                <div className="text-b1-light">
                  Please verify your account ownership to proceed.
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
