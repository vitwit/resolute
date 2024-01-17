import React from 'react';
import TopNav from '@/components/TopNav';
import { RecentTransactions } from '../../(overview)/overview-components/History';
import { TRANSFERS_MSG_FILTERS } from '@/utils/constants';
import { formatDollarAmount } from '@/utils/util';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetAuthzAssetsAmount from '@/custom-hooks/useGetAuthzAssetsAmount';

const TransfersHistory = ({ chainIDs }: { chainIDs: string[] }) => {
  return (
    <div className="right-section">
      <TopNav />
      <Balance chainIDs={chainIDs} />
      <div className="flex justify-between items-center mt-20">
        <h2 className="text-xl not-italic font-normal leading-[normal]">
          Recent Transactions
        </h2>
      </div>
      <RecentTransactions
        chainIDs={chainIDs}
        msgFilters={TRANSFERS_MSG_FILTERS}
      />
    </div>
  );
};

const Balance = ({ chainIDs }: { chainIDs: string[] }) => {
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const [, available] = useGetAssetsAmount(chainIDs);
  const [, authzAvailable] = useGetAuthzAssetsAmount(chainIDs);
  return (
    <div>
      <div className="text-white text-center mt-10">
        <div className="text-sm not-italic font-normal leading-[normal] mb-3">
          Available Balance
        </div>
        <span className="text-center text-[32px] not-italic font-bold leading-[normal]">
          {isAuthzMode
            ? formatDollarAmount(authzAvailable)
            : formatDollarAmount(available)}
        </span>
      </div>
      <div className="flex justify-center gap-6 opacity-0 mt-6">
        <button className="primary-custom-btn-disabled">
          &nbsp;&nbsp;Send&nbsp;&nbsp;
        </button>
        <button className="primary-custom-btn-disabled">Receive</button>
      </div>
    </div>
  );
};

export default TransfersHistory;
