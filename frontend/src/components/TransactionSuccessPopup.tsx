'use client';
import '@/app/txn.css';

import { Dialog, DialogContent, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import CommonCopy from './CommonCopy';
import { TXN_FAILED_ICON, TXN_SUCCESS_ICON } from '@/utils/constants';

const TransactionSuccessPopup = () => {
  const tx = useAppSelector((state) => state.common.txSuccess.tx);
  const feeAmount = tx?.fee?.[0]?.amount || '-';
  const feeDenom = tx?.fee?.[0]?.denom || '-';

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (tx) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [tx]);

  return isOpen ? (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '40px',
          background: 'linear-gradient(180deg, #2A2457 0%, #69448D 100%)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[600px] text-white flex py-[46px] flex-col justify-center items-center">
          <div className="flex flex-col items-center gap-4  px-[60px]">
            <div>
              <Image
                src={tx?.code === 0 ? TXN_SUCCESS_ICON : TXN_FAILED_ICON}
                height={60}
                width={60}
                alt="Transaction Successful"
              />
            </div>
            <div className="txn-status-text">
              {tx?.code === 0 ? (
                <span className="txt-success-text">
                  Transaction Successful !
                </span>
              ) : (
                <span className="txn-failed-text">Transaction Failed !</span>
              )}
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="message-text">2 Atom successfully sent to </span>
              <CommonCopy
                message="cosmoswrn34o23n093n31234324oimsf"
                style="max-w-[176px]"
              />
            </div> */}
          </div>
          <div className="divider"></div>
          <div className="px-[60px] w-full">
            <div className="txn-details">
              <div className="txn-details-item">
                <div className="txn-details-item-title">Transaction Hash</div>
                <div className="truncate">
                  <CommonCopy
                    message={tx?.transactionHash || '-'}
                    style="w-full"
                  />
                </div>
              </div>
              <div className="txn-details-item">
                <div className="txn-details-item-title">Fees</div>
                <div className="txn-details-item-content">
                  {feeAmount}&nbsp;{feeDenom}
                </div>
              </div>
              <div className="txn-details-item">
                <div className="txn-details-item-title">Memo</div>
                <div className="txn-details-item-content">
                  {tx?.memo || '-'}
                </div>
              </div>
            </div>
            <div className="flex gap-10 mt-6">
              <Tooltip title="Coming soon...">
                <button className="txn-receipt-btn btn-disabled">Share</button>
              </Tooltip>
              <Tooltip title="Coming soon...">
                <button className="txn-receipt-btn btn-disabled">View</button>
              </Tooltip>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default TransactionSuccessPopup;
