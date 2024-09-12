import React from 'react';
import AssetsTable from './AssetsTable';
import TokenAllocation from './TokenAllocation';
import BalanceSummary from './BalanceSummary';
import GovernanceView from './GovernanceView';
import PageHeader from '@/components/common/PageHeader';
import { useAppSelector } from '@/custom-hooks/StateHooks';

const OverviewDashboard = ({ chainIDs }: { chainIDs: string[] }) => {
  const showAuthzAlert = useAppSelector(
    (state) => state.authz.authzAlert.display
  );
  return (
    <div>
      <div className="flex pt-10 gap-10">
        <div className="flex flex-1">
          <div
            className={`flex flex-col gap-10 overflow-y-auto pb-3 w-full ${showAuthzAlert ? 'h-[calc(100vh-158px)]' : 'h-[calc(100vh-104px)]'}`}
          >
            <div className="">
              <OverviewHeader />
            </div>
            <BalanceSummary chainIDs={chainIDs} />
            <AssetsTable chainIDs={chainIDs} />
          </div>
        </div>
        <div
          className={`flex flex-col gap-10 pb-3 ${showAuthzAlert ? 'h-[calc(100vh-158px)]' : 'h-[calc(100vh-104px)]'}`}
        >
          <TokenAllocation />
          <GovernanceView chainIDs={chainIDs} />
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;

const OverviewHeader = () => {
  return (
    <PageHeader
      title="Dashboard"
      description="Summary of your digital assets"
    />
  );
};
