import {
  REDIRECT_ICON,
  TXN_FAILED_ICON,
  TXN_SUCCESS_ICON,
} from '@/constants/image-names';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getRecentTransactions } from '@/store/features/recent-transactions/recentTransactionsSlice';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { IBC_SEND_TYPE_URL, SEND_TYPE_URL } from '@/utils/constants';
import { getTxnURL, shortenMsg } from '@/utils/util';
import { Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import TxnMessage from '../TxnMessage';
import { parseBalance } from '@/utils/denom';
import Copy from '../common/Copy';
import ShareTxn from './ShareTxn';

const TransactionStatusPopup = () => {
  const tx = useAppSelector((state) => state.common.txSuccess.tx);
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork.chainName
  );
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const { getAllChainAddresses } = useGetChainInfo();

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

  useEffect(() => {
    if (tx?.msgs) {
      const chainIDs = selectedNetwork?.length
        ? [nameToChainIDs[selectedNetwork]]
        : Object.values(nameToChainIDs);
      if (tx?.msgs[0]?.typeUrl === SEND_TYPE_URL) {
        dispatch(
          getRecentTransactions({
            addresses: getAllChainAddresses(chainIDs),
            module: 'bank',
          })
        );
      } else if (!(tx?.msgs[0]?.typeUrl === IBC_SEND_TYPE_URL)) {
        dispatch(
          getRecentTransactions({
            addresses: getAllChainAddresses(chainIDs),
            module: 'all',
          })
        );
      }
    }
  }, [tx]);

  return isOpen ? (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      sx={{
        '& .MuiDialog-paper': {
          color: 'white',
        },
      }}
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[600px] pt-20">
          <div className="p-10 flex justify-center items-center flex-col gap-20">
            <div>
              <Image
                src={tx?.code === 0 ? TXN_SUCCESS_ICON : TXN_FAILED_ICON}
                height={100}
                width={100}
                alt="Transaction Successful"
              />
            </div>
            <div className="w-full">
              <div className="flex items-center gap-2 justify-center">
                <div className="text-h1 !font-semibold">
                  {tx?.code === 0 ? (
                    <span>Transaction Successful</span>
                  ) : (
                    <span>Transaction Failed</span>
                  )}
                </div>
                <ShareTxn
                  content={getTxnURL(
                    explorerTxHashEndpoint,
                    tx?.transactionHash || ''
                  )}
                />
                <Link
                  className="txn-receipt-btn"
                  href={getTxnURL(
                    explorerTxHashEndpoint,
                    tx?.transactionHash || ''
                  )}
                  target="_blank"
                >
                  <Image src={REDIRECT_ICON} width={32} height={32} alt="" />
                </Link>
              </div>
              <div className="divider-line mt-4 mb-6"></div>
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <TxnMessage
                    msgs={tx?.msgs || []}
                    currency={currency}
                    failed={tx?.code !== 0}
                  />
                </div>
                <div className="flex gap-6">
                  <div className="txn-status-data">
                    <div>Fees</div>
                    <div>
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
                  <div className="txn-status-data">
                    <div>Txn Messages</div>
                    <div>#{tx?.msgs?.length}</div>
                  </div>
                </div>
                <div className="txn-status-data">
                  <div className="text-small">Txn Hash</div>
                  <div className="flex items-center gap-1">
                    <div>
                      {shortenMsg(tx?.transactionHash || '', 30) || '-'}
                    </div>
                    {tx?.transactionHash ? (
                      <Copy content={tx?.transactionHash} />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default TransactionStatusPopup;
