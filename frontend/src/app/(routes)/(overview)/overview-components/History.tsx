import React from 'react';
import SideAd from './SideAd';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { formatDollarAmount } from '@/utils/util';
import TopNav from '@/components/TopNav';
import TransactionItem from './TransactionItem';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';

const History = ({ chainIDs }: { chainIDs: string[] }) => {
  return (
    <div className="right-section">
      <TopNav />

      <Balance chainIDs={chainIDs} />
      <SideAd />

      <div className="flex justify-between items-center">
        <h2 className="text-white text-md font-bold leading-normal">
          Recent Transactions
        </h2>
        <div className="text-[#9C9C9C] cursor-pointer text-sm font-extralight leading-normal underline underline-offset-2">
          View All
        </div>
      </div>
      <RecentTransactions chainIDs={chainIDs} />
    </div>
  );
};

export default History;

const Balance = ({ chainIDs }: { chainIDs: string[] }) => {
  const [staked, available, rewards] = useGetAssetsAmount(chainIDs);
  return (
    <div>
      <div className="text-white text-center my-6">
        <div className="text-white text-sm font-extralight">Total Balance</div>
        <span className="text-[32px] leading-normal font-bold">
          {formatDollarAmount(staked + available + rewards)}
        </span>
      </div>
      <div className="flex justify-center gap-6">
        <button className="primary-action-btn">Send</button>
        <button className="primary-action-btn">Delegate</button>
      </div>
    </div>
  );
};

const RecentTransactions = ({ chainIDs }: { chainIDs: string[] }) => {
  /**
   * Note: Currently, this implementation of recent transactions addresses scenarios involving either a single chain or all chains.
   *        If the system evolves to support multiple selected chains in the future,
   *        modifications to this logic will be necessary.
   */
  const transactions = useAppSelector(
    (state: RootState) =>
      (chainIDs.length == 1
        ? state.transactionHistory.chains[chainIDs[0]]
        : state.transactionHistory.allTransactions) || []
  );
  return (
    <div className="flex-1 overflow-y-scroll">
      <div className="text-white w-full space-y-2 mt-6">
        {transactions.map((tx) => (
          <TransactionItem key={tx.transactionHash} transaction={tx} />
        ))}
      </div>
    </div>
  );
};
