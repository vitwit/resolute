'use client';
import '@/app/txn.css';

import { Box, Dialog, DialogContent } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { TXN_FAILED_ICON, TXN_SUCCESS_ICON } from '@/utils/constants';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { setError } from '@/store/features/common/commonSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Link from 'next/link';
import { getTxnURL } from '@/utils/util';
import TxnMessage from './TxnMessage';
import { parseBalance } from '@/utils/denom';

const TransactionSuccessPopup = () => {
  const tx = useAppSelector((state) => state.common.txSuccess.tx);

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { explorerTxHashEndpoint = '' } = tx?.chainID
    ? getChainInfo(tx.chainID)
    : {};
  const {
    decimals = 0,
    displayDenom = '',
    minimalDenom = '',
  } = tx?.chainID ? getDenomInfo(tx?.chainID) : {};
  const currency = useMemo(
    () => ({
      coinMinimalDenom: minimalDenom,
      coinDecimals: decimals,
      coinDenom: displayDenom,
    }),
    [minimalDenom, decimals, displayDenom]
  );

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
      sx={{ backgroundColor: '#07051360' }}
      PaperProps={{
        sx: {
          borderRadius: '40px',
          backgroundColor: '#15122D',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <Box
          sx={{
            width: '600px',
            borderRadius: '40px',
            background:
              'linear-gradient(178deg, #241B61 1.71%, #69448D 98.35%, #69448D 98.35%)',
          }}
        >
          <div className="w-[600px] text-white flex py-[46px] flex-col justify-center items-center">
            <div className="flex flex-col items-center gap-4  px-[60px]">
              <div>
                <Image
                  src={tx?.code === 0 ? TXN_SUCCESS_ICON : TXN_FAILED_ICON}
                  height={48}
                  width={48}
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
              <TxnMessage
                msgs={tx?.msgs || []}
                currency={currency}
                failed={tx?.code !== 0}
              />
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              <Image
                src="/semi-circle-left.svg"
                draggable={false}
                height={30}
                width={30}
                alt=""
              />
              <div className="divider my-10"></div>
              <Image
                src="/semi-circle-right.svg"
                draggable={false}
                height={30}
                width={30}
                alt=""
              />
            </div>
            <div className="px-[60px] w-full">
              <div className="txn-details">
                <div className="txn-details-item">
                  <div className="txn-details-item-title">Transaction Hash</div>
                  <div className="truncate">
                    <div className="w-full common-copy">
                      <span className="truncate">
                        {tx?.transactionHash || '-'}
                      </span>
                      <Image
                        className="cursor-pointer"
                        onClick={(e) => {
                          copyToClipboard(tx?.transactionHash || '-');
                          dispatch(
                            setError({
                              type: 'success',
                              message: 'Copied',
                            })
                          );
                          e.stopPropagation();
                        }}
                        src="/copy-icon-plain.svg"
                        width={24}
                        height={24}
                        alt="copy"
                      />
                    </div>
                  </div>
                </div>
                <div className="txn-details-item">
                  <div className="txn-details-item-title">Fees</div>
                  <div className="txn-details-item-content">
                    {tx?.fee?.[0]
                      ? parseBalance(
                          tx?.fee,
                          currency.coinDecimals,
                          currency.coinMinimalDenom
                        )
                      : '-'}{' '}
                    {currency.coinDenom}
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
                <button
                  className="txn-receipt-btn"
                  onClick={() => {
                    copyToClipboard(
                      getTxnURL(
                        explorerTxHashEndpoint,
                        tx?.transactionHash || ''
                      )
                    );
                    dispatch(setError({ type: 'success', message: 'Copied' }));
                  }}
                >
                  Share
                </button>
                <Link
                  className="txn-receipt-btn"
                  href={getTxnURL(
                    explorerTxHashEndpoint,
                    tx?.transactionHash || ''
                  )}
                  target="_blank"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default TransactionSuccessPopup;
