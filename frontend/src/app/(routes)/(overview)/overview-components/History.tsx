import React from 'react';
import SideAd from './SideAd';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { formatDollarAmount } from '@/utils/util';
import TopNav from '@/components/TopNav';
import TransactionItem from './TransactionItem';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import NoTransactions from '@/components/illustrations/NoTransactions';

const History = ({ chainIDs }: { chainIDs: string[] }) => {
  return (
    <div className="right-section">
      <TopNav />

      <Balance chainIDs={chainIDs} />
      <SideAd />

      <div className="mt-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl not-italic font-normal leading-[normal]">
            Recent Transactions
          </h2>
        </div>
        <RecentTransactions chainIDs={chainIDs} msgFilters={[]} />
      </div>
    </div>
  );
};

export default History;

const Balance = ({ chainIDs }: { chainIDs: string[] }) => {
  const router = useRouter();
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const getPath = (chainIDs: string[], module: string) => {
    if (chainIDs.length !== 1) {
      return '/' + module;
    }
    let curChainName: string = '';
    Object.keys(nameToChainIDs).forEach((chainName) => {
      if (nameToChainIDs[chainName] === chainIDs[0]) curChainName = chainName;
    });
    return '/' + module + '/' + curChainName;
  };
  const [staked, available, rewards] = useGetAssetsAmount(chainIDs);
  return (
    <div>
      <div className="text-white text-center mt-10 mb-6">
        <div className="text-sm not-italic font-normal leading-[normal] mb-3">
          Total Balance
        </div>
        <span className="text-center text-[32px] not-italic font-bold leading-[normal]">
          {formatDollarAmount(staked + available + rewards)}
        </span>
      </div>
      <div className="flex justify-center gap-6">
        <button
          className="primary-custom-btn"
          onClick={() => {
            router.push(getPath(chainIDs, 'transfers'));
          }}
        >
          &nbsp;&nbsp;Send&nbsp;&nbsp;
        </button>
        <button
          className="primary-custom-btn"
          onClick={() => {
            router.push(getPath(chainIDs, 'staking'));
          }}
        >
          Delegate
        </button>
      </div>
    </div>
  );
};

export const RecentTransactions = ({
  chainIDs,
  msgFilters,
}: {
  chainIDs: string[];
  msgFilters: string[];
}) => {
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
    <div className="max-h-[470px] min-h-[470px] overflow-y-scroll">
      {transactions.length ? (
        <div className="text-white w-full space-y-3">
          {transactions.map((tx) => (
            <TransactionItem
              key={tx.transactionHash}
              transaction={tx}
              msgFilters={msgFilters}
            />
          ))}
        </div>
      ) : (
        <div className="max-h-[400px] min-h-[400px] flex items-center flex-1">
          <NoTransactions />
        </div>
      )}
    </div>
  );
};
