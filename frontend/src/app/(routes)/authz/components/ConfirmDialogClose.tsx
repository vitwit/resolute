import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { Dialog, DialogContent } from '@mui/material';
import React from 'react';

interface ConfirmDialogCloseProps {
  open: boolean;
  onClose: () => void;
  closeMainDialog: () => void;
}

const ConfirmDialogClose = ({
  open,
  onClose,
  closeMainDialog,
}: ConfirmDialogCloseProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[445px] text-white mt-16 mb-12">
          <div className="px-10 my-6 space-y-6">
            <div className="font-light text-[16px] leading-[24px]">
              Are you sure you want to close the popup ? This action cannot be
              undone
            </div>
            <div className="flex gap-10 items-center">
              <button
                onClick={() => {
                  onClose();
                  closeMainDialog();
                }}
                className="primary-custom-btn"
              >
                Confirm
              </button>
              <button
                onClick={onClose}
                className="font-medium tracking-[0.64px] underline underline-offset-[3px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialogClose;
