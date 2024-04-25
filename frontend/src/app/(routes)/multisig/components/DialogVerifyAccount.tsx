import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { Dialog, DialogContent } from '@mui/material';
import React from 'react';
import VerifyAccount from './VerifyAccount';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setVerifyDialogOpen } from '@/store/features/multisig/multisigSlice';
import Image from 'next/image';
import { CLOSE_ICON_PATH } from '@/utils/constants';

const DialogVerifyAccount = ({ address }: { address: string }) => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.multisig.verifyDialogOpen);
  const handleClose = () => {
    dispatch(setVerifyDialogOpen(false));
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 py-6 pt-10 flex justify-end">
            <div onClick={handleClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
                draggable={false}
              />
            </div>
          </div>
          <div className="mb-10 flex gap-6 px-10 items-center">
            <VerifyAccount walletAddress={address} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogVerifyAccount;
