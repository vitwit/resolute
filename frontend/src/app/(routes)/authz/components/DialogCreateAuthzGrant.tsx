import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface DialogCreateAuthzGrantProps {
  open: boolean;
  onClose: () => void;
}

const DialogCreateAuthzGrant: React.FC<DialogCreateAuthzGrantProps> = (
  props
) => {
  const { open, onClose } = props;
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
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
            <div onClick={onClose}>
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
          <div className="mb-[72px] flex gap-16 px-10 items-center text-justify">
            <h2 className="text-[20px] font-bold">Create Grant</h2>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateAuthzGrant;
