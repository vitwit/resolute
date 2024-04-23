import TopNav from '@/components/TopNav';
import React, { useState } from 'react';
import Transaction from './Transaction';
import useGetTransactions from '@/custom-hooks/useGetTransactions';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { CircularProgress, Pagination } from '@mui/material';
import { paginationComponentStyles } from '../../staking/styles';
import TxnRepeatLoader from './TxnRepeatLoader';
import { TxStatus } from '@/types/enums';

const ITEMS_PER_PAGE = 5;

const PageTxnHistory = ({ chainName }: { chainName: string }) => {
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainID = nameToChainIDs[chainName];

  const [currentPage, setCurrentPage] = useState(1);

  const { getDenomInfo, getChainInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };
  const { getTransactions, fetchTransactions } = useGetTransactions({
    chainID,
  });
  const { txns } = getTransactions();
  const txnsLoading = useAppSelector(
    (state) => state.recentTransactions.txns.status
  );

  const handlePageChange = (value: number) => {
    const offset = (value - 1) * ITEMS_PER_PAGE;
    fetchTransactions(ITEMS_PER_PAGE, offset);
    setCurrentPage(value);
  };

  const totalCount = useAppSelector(
    (state) => state.recentTransactions?.txns?.total
  );

  const pagesCount = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const showPagination =
    txns?.length && txnsLoading !== TxStatus.PENDING && pagesCount !== 0;

  return (
    <div className="py-6 px-10 h-screen space-y-10 overflow-y-scroll">
      <div className="flex justify-between flex-1">
        <h2 className="text-[20px] leading-normal font-normal">
          Transaction History
        </h2>
        <TopNav />
      </div>
      {txnsLoading === TxStatus.PENDING ? (
        <div className="flex justify-center items-center h-1/2">
          <div className="flex gap-4 items-center">
            <CircularProgress size={24} sx={{ color: 'white' }} />
            <div>
              <span className="italic font-extralight">
                Fetching Transactions
              </span>
              <span className="dots-flashing"></span>
            </div>
          </div>
        </div>
      ) : txns.length ? (
        <div className="space-y-2">
          {txns?.map((txn) => (
            <Transaction
              txn={txn}
              key={txn.txhash}
              currency={currency}
              basicChainInfo={basicChainInfo}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-1/2">
          <div className="text-[16px]">
            {txnsLoading === TxStatus.REJECTED ? (
              <div className="text-red-400">- Failed to fetch transactions -</div>
            ) : (
              '- No Transactions -'
            )}
          </div>
        </div>
      )}
      {showPagination ? (
        <div className="flex justify-end">
          <Pagination
            sx={paginationComponentStyles}
            count={pagesCount}
            page={currentPage}
            shape="circular"
            onChange={(_, value) => {
              handlePageChange(value);
            }}
          />
        </div>
      ) : null}
      <TxnRepeatLoader />
    </div>
  );
};

export default PageTxnHistory;
