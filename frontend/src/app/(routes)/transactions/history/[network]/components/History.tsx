import ChainNotFound from '@/components/ChainNotFound';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import React from 'react';
import TransactionHistoryDashboard from './TransactionHistoryDashboard';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';

const History = () => {
  const { network } = useParams();
  const chainName = typeof network === 'string' ? network : '';

  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.common.nameToChainIDs
  );

  const isValidChain = Object.keys(nameToChainIDs).some(
    (chain) => chainName.toLowerCase() === chain.toLowerCase()
  );

  if (isValidChain) {
    const chainID = nameToChainIDs[chainName];

    return (
      <div>
        <PageHeader
          title="History"
          description="Record of all your transactions, providing detailed insights into each transaction's date, time, amount, and status."
        />
        <TransactionHistoryDashboard chainID={chainID} />
      </div>
    );
  }

  return <ChainNotFound />;
};

export default History;
