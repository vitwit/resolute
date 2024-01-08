import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface DialogRevokeProps {
  open: boolean;
  onClose: () => void;
}

const DialogRevoke: React.FC<DialogRevokeProps> = (props) => {
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
         <div>
            <div className='flex'>
                <Image
                src="/revoke-image.png"
                width={288}
                height={238}
                alt=""
                draggable={false}
                />
            </div>
         </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogRevoke;
