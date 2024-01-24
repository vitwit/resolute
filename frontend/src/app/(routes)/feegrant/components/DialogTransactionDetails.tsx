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
  const transactionMessages = [
    'Vote',
    'Send',
    'Feegrant',
    'Delegate',
    'Revoke Grant',
    'Claim Rewards',
  ];
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
          <div className="max-w-[890px] text-white px-10 pb-6 pt-10">
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
            <div className="">
              <div>Details</div>
            </div>
            <div className="divider-line space-y-4"></div>
            <div className="flex flex-wrap gap-6">
              {transactionMessages.map((message, index) => (
                <div key={index} className="transaction-message-btn">
                  <p className="feegrant-address">{message}</p>
                </div>
              ))}
            </div>
            <div className="flex w-full justify-between">
              <div className="space-y-4">
                <div className="authz-small-text">Spend Limit</div>
                <div className="text-background">{}</div>
              </div>
              <div>
                <div className="space-y-4">
                  <div className="authz-small-text">Expiry</div>
                  <div className="text-background">{}</div>
                </div>
              </div>
            </div>
            <button className="main-btn w-[139px] cursor-pointer">
              Revoke
            </button>
            <div className="justify-end items-center gap-2.5 pt-10 pb-0 px-6"></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogTransactionDetails;
