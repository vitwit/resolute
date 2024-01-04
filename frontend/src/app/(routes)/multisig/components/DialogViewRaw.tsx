import { Txn } from '@/types/multisig';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface DialogViewRawProps {
  open: boolean;
  onClose: () => void;
  txn: Txn;
}

const DialogViewRaw: React.FC<DialogViewRawProps> = (props) => {
  const { open, onClose, txn } = props;
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
            <div
              onClick={() => {
                handleClose();
              }}
            >
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
          <div className="mb-10 space-y-6 px-10 text-white">
            <div className="text-[20px] leading-normal font-bold">Raw</div>
            <div className="raw-content">
              {txn ? (
                <pre>{JSON.stringify(txn, undefined, 2)}</pre>
              ) : (
                <div className="text-center">- No Data -</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogViewRaw;
