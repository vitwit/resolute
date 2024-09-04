import React, { useState } from 'react';
import SearchTransactionHash from './SearchTransactionHash';
import useGetTransactions from '@/custom-hooks/useGetTransactions';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import TransactionCard from './TransactionCard';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import DialogLoader from '@/components/common/DialogLoader';
import { TxStatus } from '@/types/enums';
import { Pagination } from '@mui/material';
import { paginationComponentStyles } from '@/utils/commonStyles';
import TxnsLoading from '../../loaders/TxnsLoading';
import useInitTransactions from '@/custom-hooks/useInitTransactions';

const ITEMS_PER_PAGE = 7;

const TransactionHistoryDashboard = ({ chainID }: { chainID: string }) => {
  useInitTransactions({chainID})
  const { getChainInfo } = useGetChainInfo();
  
  const basicChainInfo = getChainInfo(chainID);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const txnHistory = useGetTransactions({ chainID });

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    txnHistory.fetchTransaction(e.target.value);
  };

  const transactions = useAppSelector((state: RootState) =>
    searchQuery
      ? state.recentTransactions.txn?.data
      : state.recentTransactions.txns?.data
  );
  const txnRepeatStatus = useAppSelector(
    (state) => state.recentTransactions?.txnRepeat?.status
  );
  const txnsLoading = useAppSelector(
    (state) => state.recentTransactions.txns.status
  );
  const loading = txnRepeatStatus === TxStatus.PENDING;
  const handlePageChange = (value: number) => {
    const offset = (value - 1) * ITEMS_PER_PAGE;
    txnHistory.fetchTransactions(ITEMS_PER_PAGE, offset);
    setCurrentPage(value);
  };

  const totalCount = useAppSelector(
    (state) => state.recentTransactions?.txns?.total
  );

  const pagesCount = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const showPagination =
    transactions?.length &&
    txnsLoading !== TxStatus.PENDING &&
    pagesCount !== 0;

  return (
    <div className="flex flex-col py-10 gap-10">
      <div className="px-6">
        <SearchTransactionHash
          searchQuery={searchQuery}
          handleSearchQueryChange={handleSearchQueryChange}
        />
      </div>
      <div className="flex flex-col gap-6 px-6">
        {transactions?.map((txn) => (
          <TransactionCard
            key={txn.txhash}
            txn={txn}
            // currency={currency}
            basicChainInfo={basicChainInfo}
          />
        ))}
      </div>
      {txnsLoading === TxStatus.PENDING ? <TxnsLoading /> : null}
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
      <DialogLoader open={loading} loadingText="Pending" />
    </div>
  );
};

export default TransactionHistoryDashboard;
