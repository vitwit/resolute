import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import React from 'react';

const DialogLoader = ({
  open,
  loadingText,
}: {
  open: boolean;
  loadingText?: string;
}) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: '#ffffff1a',
        },
      }}
      sx={{
        backdropFilter: 'blur(2px)',
      }}
    >
      <DialogContent>
        <div className="flex gap-4 items-center">
          <CircularProgress size={32} sx={{ color: 'white' }} />
          <div className="">
            <span className="italic text-[#fffffff0]">
              {loadingText || 'Loading'}
            </span>
            <span className="dots-flashing"></span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogLoader;
