import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface DialogCreateFeegrantProps {
  open: boolean;
  onClose: () => void;
}

const DialogCreateFeegrant: React.FC<DialogCreateFeegrantProps> = (props) => {
  const { open, onClose } = props;

  const handleDialogClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
            <div onClick={handleDialogClose}>
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
          <div className="mb-[72px] px-10">
            <div className="space-y-4">
              <h2 className="text-[20px] font-bold">Create Grant</h2>
            </div>
            <div className="divider-line"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateFeegrant;
