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
        <h2 className="text-xl not-italic font-bold leading-[normal]">
          Recent Transactions
        </h2>
        <div className="text-right text-xs not-italic font-normal leading-[normal] underline">
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
        <div className="text-sm not-italic font-normal leading-[normal] mb-2">
          Available
        </div>
        <span className="text-center text-[32px] not-italic font-bold leading-[normal]">
          {formatDollarAmount(available )}
        </span>
      </div>
      <div className="flex justify-center gap-6">
        <button className="primary-custom-btn">Send</button>
        <button className="primary-custom-btn">Receive</button>
      </div>
    </div>
  );
};

export default TransfersHistory;
