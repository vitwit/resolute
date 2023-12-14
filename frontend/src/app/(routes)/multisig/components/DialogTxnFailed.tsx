import {
  CLOSE_ICON_PATH,
  DELETE_TXN_DIALOG_IMAGE_PATH,
} from '@/utils/constants';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface DialogTxnFailedProps {
  open: boolean;
  onClose: () => void;
  errMsg: string;
}

const DialogTxnFailed: React.FC<DialogTxnFailedProps> = (props) => {
  const { open, onClose, errMsg } = props;
  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
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
            <div onClick={() => onClose()}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="mt-6 mb-[72px] flex gap-10 pr-10 pl-6 items-center">
            <Image
              src={DELETE_TXN_DIALOG_IMAGE_PATH}
              height={238}
              width={288}
              alt="Delete Txn"
            />
            <div className="flex flex-col gap-10 w-full">
              <div className="space-y-6">
                <h2 className="text-[20px] font-bold leading-normal">
                  Status : Failed
                </h2>
                <div className="p-4 rounded-2xl bg-[#FFFFFF1A] font-extralight text-[14px]">
                  {errMsg}
                </div>
                <div className="mt-10 flex gap-10 items-center">
                  <button
                    type="submit"
                    className="create-account-btn"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTxnFailed;
