import { formatDollarAmount } from '@/utils/util';
import React from 'react';
import StakingStatsCard from './StakingStatsCard';
import TopNav from '@/components/TopNav';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import StakingSideBarAds from './StakingSideBarAds';

const StakingOverviewSidebar = () => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.values(nameToChainIDs);

  const [totalStakedAmount, , rewards] = useGetAssetsAmount(chainIDs);
  return (
    <div className="staking-sidebar">
      <div className="flex flex-col gap-6">
        <TopNav />
        <div className="flex gap-10">
          <StakingStatsCard
            name={'Staked Balance'}
            value={formatDollarAmount(totalStakedAmount)}
          />
          <StakingStatsCard
            name={'Rewards'}
            value={formatDollarAmount(rewards)}
          />
        </div>
        <div className="staking-sidebar-actions">
          <button className="staking-sidebar-actions-btn">Claim All</button>
          <button className="staking-sidebar-actions-btn">
            Claim and stake all
          </button>
        </div>
      </div>
      <StakingSideBarAds />
    </div>
  );
};

export default StakingOverviewSidebar;
