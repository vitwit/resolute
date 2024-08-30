import React, { useState } from 'react';
import SearchTransactionHash from './SearchTransactionHash';
import useGetTransactions from '@/custom-hooks/useGetTransactions';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import TransactionCard from './TransactionCard';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import DialogLoader from '@/components/common/DialogLoader';
import { TxStatus } from '@/types/enums';

const TransactionHistoryDashboard = ({ chainID }: { chainID: string }) => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const { displayDenom, decimals, minimalDenom } = getDenomInfo(chainID);
  const basicChainInfo = getChainInfo(chainID);

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
  const loading = txnRepeatStatus === TxStatus.PENDING;

  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };

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
            currency={currency}
            basicChainInfo={basicChainInfo}
          />
        ))}
      </div>
      <DialogLoader open={loading} loadingText="Pending" />
    </div>
  );
};

export default TransactionHistoryDashboard;
