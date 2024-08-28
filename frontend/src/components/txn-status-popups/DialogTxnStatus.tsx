import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const DialogTxnStatus = ({
  handleClose,
  open,
  children,
}: {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}) => {
  return open ? (
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
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[450px] py-10 relative">
          <button
            className="absolute top-6 right-6 hover:bg-[#ffffff10] w-8 h-8 rounded-full flex items-center justify-center"
            onClick={handleClose}
          >
            <Image src="/close.svg" width={20} height={20} alt="close-icon" />
          </button>
          <div className="p-10 flex justify-center items-center flex-col gap-10">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default DialogTxnStatus;
