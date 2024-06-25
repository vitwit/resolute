import CustomButton from '@/components/common/CustomButton';
import { DELETE_ILLUSTRATION } from '@/constants/image-names';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const DialogConfirmExitSession = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
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
        <div className="w-[550px] p-4">
          <div className="px-10 py-20 space-y-10">
            <div className="flex flex-col items-center gap-6">
              <Image
                src={DELETE_ILLUSTRATION}
                width={150}
                height={150}
                alt="Verify Ownership"
              />
              <div className="flex items-center flex-col gap-2">
                <div className="text-h1 !font-semibold">Logout</div>
                <div className="text-b1-light">
                  Are you sure you want to logout?
                </div>
              </div>
            </div>
            <CustomButton
              btnOnClick={onConfirm}
              btnText="Logout"
              btnStyles="w-full !border-[#D92101] !bg-[#D921011A] logout-btn"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogConfirmExitSession;
