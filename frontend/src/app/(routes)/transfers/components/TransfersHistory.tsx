import React from 'react';
import TopNav from '@/components/TopNav';
import { RecentTransactions } from '../../(overview)/overview-components/History';
import { TRANSFERS_MSG_FILTERS } from '@/utils/constants';
import { formatDollarAmount } from '@/utils/util';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';

const TransfersHistory = ({ chainIDs }: { chainIDs: string[] }) => {
  return (
    <div className="right-section">
      <TopNav />
      <Balance chainIDs={chainIDs} />
      <div className="flex justify-between items-center mt-10">
        <h2 className="text-white text-md font-bold leading-normal">
          Recent Transactions
        </h2>
        <div className="text-[#9C9C9C] cursor-pointer text-sm font-extralight leading-normal underline underline-offset-2">
          View All
        </div>
      </div>
      <RecentTransactions
        chainIDs={chainIDs}
        msgFilters={TRANSFERS_MSG_FILTERS}
      />
    </div>
  );
};

const Balance = ({ chainIDs }: { chainIDs: string[] }) => {
  const [, available] = useGetAssetsAmount(chainIDs);
  return (
    <div>
      <div className="text-white text-center my-6">
        <div className="text-white text-sm font-extralight">Available</div>
        <span className="text-[32px] leading-normal font-bold">
          {formatDollarAmount(available)}
        </span>
      </div>
      <div className="flex justify-center gap-6">
        <button className="primary-action-btn">Send</button>
        <button className="primary-action-btn">Receive</button>
      </div>
    </div>
  );
};

export default TransfersHistory;
