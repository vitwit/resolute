import { formatDollarAmount } from '@/utils/util';
import React from 'react';
import StakingStatsCard from './StakingStatsCard';
import TopNav from '@/components/TopNav';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import StakingSideBarAds from './StakingSideBarAds';
import { Tooltip } from '@mui/material';
import useGetAuthzAssetsAmount from '@/custom-hooks/useGetAuthzAssetsAmount';

const StakingOverviewSidebar = () => {
  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.values(nameToChainIDs);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);

  const [stakedAmount, , rewardsAmount] = useGetAssetsAmount(chainIDs);
  const [authzStakedAmount, , authzRewardsAmount] =
    useGetAuthzAssetsAmount(chainIDs);

  const totalStakedAmount = isAuthzMode ? authzStakedAmount : stakedAmount;
  const rewards = isAuthzMode ? authzRewardsAmount : rewardsAmount;

  return (
    <div className="staking-sidebar">
      <div className="flex flex-col gap-10">
        <TopNav />
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
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
            <Tooltip title="Coming soon..">
              <button className="staking-sidebar-actions-btn cursor-not-allowed">
                Claim All
              </button>
            </Tooltip>
            <Tooltip title="Coming soon..">
              <button className="staking-sidebar-actions-btn cursor-not-allowed">
                Restake All
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      <StakingSideBarAds />
    </div>
  );
};

export default StakingOverviewSidebar;
