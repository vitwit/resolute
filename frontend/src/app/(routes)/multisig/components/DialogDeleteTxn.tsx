import { Txn } from '@/types/multisig';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface DialogDeleteTxnProps {
  open: boolean;
  onClose: () => void;
  txn: Txn | undefined;
}

const DialogDeleteTxn = ({ open, onClose, txn }: DialogDeleteTxnProps) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 py-6 flex justify-end">
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
              />
            </div>
          </div>
          <div className="mt-6 mb-[72px] space-y-6 px-10 text-white">
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
export default DialogDeleteTxn;
