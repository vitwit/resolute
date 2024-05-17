import CommonCopy from '@/components/CommonCopy';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const DialogAddressesList = ({
  addresses,
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
  addresses: string[];
}) => {
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
          <div className="px-10 space-y-4 pb-10">
            <div className="space-y-1">
              <div className="flex items-center text-white text-xl not-italic font-bold leading-[normal]">
                Allowed Addresses
              </div>
              <div className="text-[12px] font-light">
                List of addresses that are allowed to instantiate contract{' '}
              </div>
            </div>
            <div className="divider-line"></div>
            <div className="flex flex-wrap gap-4">
              {addresses.map((address) => (
                <div key={address}>
                  <CommonCopy message={address} style="" plainIcon={true} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddressesList;
