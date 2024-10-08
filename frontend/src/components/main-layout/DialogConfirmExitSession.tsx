import CustomButton from '@/components/common/CustomButton';
import { LOGOUT_ICON } from '@/constants/image-names';
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
        <div className="w-[450px] p-4 relative">
          <button
            className="absolute top-6 right-6 hover:bg-[#ffffff10] w-8 h-8 rounded-full flex items-center justify-center"
            onClick={onClose}
          >
            <Image src="/close.svg" width={20} height={20} alt="close-icon" />
          </button>
          <div className="px-10 py-20 space-y-10">
            <div className="flex flex-col items-center gap-6">
              <Image
                src={LOGOUT_ICON}
                width={60}
                height={60}
                alt="Verify Ownership"
              />
              <div className="flex items-center flex-col gap-2">
                <div className="text-[18px] font-bold">Logout</div>
                <div className="text-b1-light">
                  Are you sure you want to logout?
                </div>
              </div>
            </div>
            <CustomButton
              btnOnClick={onConfirm}
              btnText="Logout"
              btnStyles="w-full !border-[#D92101] !bg-[#D921011A] logout-btn text-b1"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogConfirmExitSession;
