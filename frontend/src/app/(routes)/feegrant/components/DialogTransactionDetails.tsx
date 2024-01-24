import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { Dialog, DialogContent } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import { CLOSE_ICON_PATH } from '@/utils/constants';

const DialogTransactionDetails = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const handleDialogClose = () => {
    onClose();
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        maxWidth="lg"
        PaperProps={{
          sx: dialogBoxPaperPropStyles,
        }}
      >
        <DialogContent sx={{ padding: 0 }}>
        <div className="max-w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
            {' '}
            <div onClick={onClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="close"
                draggable={false}
              />
            </div>
          </div>
          <div className="gap-16 px-10 space-y-6">
            <div>Details</div>
          </div>
          <div className="divider-line space-y-4"></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogTransactionDetails;
