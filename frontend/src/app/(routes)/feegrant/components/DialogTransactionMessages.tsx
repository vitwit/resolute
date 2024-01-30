import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { Dialog, DialogContent } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { getTypeURLName } from '@/utils/authorizations';

const DialogTransactionMessages = ({
  open,
  onClose,
  msgs = [],
}: {
  open: boolean;
  onClose: () => void;
  msgs: string[];
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
            <div className="gap-16 px-10 space-y-6">
              <div className="flex justify-between">
                <div className="flex items-center text-white text-xl not-italic font-bold leading-[normal]">
                  Transaction Messages
                </div>
              </div>
              <div className="divider-line space-y-4"></div>
              {msgs.map((row, rowIndex) => (
                <div key={rowIndex}
                  className="flex flex-wrap gap-6">
                  <div
                    key={row}
                    className=""
                    onClick={() => console.log(`Clicked: ${row}`)}
                  >
                    <p className="message-style">{getTypeURLName(row)}</p>
                  </div>
                </div>
              ))}
              <button className="main-btn w-[139px] cursor-pointer">
                Revoke
              </button>
              <div className="justify-end items-center gap-2.5 pt-10 pb-0 px-6"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogTransactionMessages;
