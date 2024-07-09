'use client';

// import ValidatorTable from './ValidatorTable';
import useSingleStaking from '@/custom-hooks/useSingleStaking';
import StakingSummary from '../components/StakingSummary';
import StakingUnDelegations from '../components/StakingUnDelegations';
import StakingDelegations from '../components/StakingDelegations';
import ValidatorTable from '../components/ValidatorTable';
import { useAppSelector } from '@/custom-hooks/StateHooks';
// import { RootState } from '@/store/store';
// import { useAppSelector } from '@/custom-hooks/StateHooks';

const SingleStakingDashboard = ({ chainID }: { chainID: string }) => {
  const staking = useSingleStaking(chainID);
  const {
    totalStakedAmount,
    rewardsAmount,
    totalUnStakedAmount,
    availableAmount,
  } = staking.getStakingAssets();
  const delegations = staking.getAllDelegations(chainID);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const stakingData = useAppSelector((state) => state.staking.chains);
  const authzStakingData = useAppSelector(
    (state) => state.staking.authz.chains
  );
  const hasUnbondings = isAuthzMode
    ? authzStakingData[chainID]?.unbonding?.hasUnbonding
    : stakingData[chainID]?.unbonding.hasUnbonding;

  return (
    <div className="flex flex-col items-start gap-10 w-full py-10">
      <div className="flex flex-col w-full gap-6">
        <div className="items-start">
          <div className="text-[28px] font-bold leading-[normal]">
            Staking
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm font-extralight leading-8 pb-2">
            Summary of Staked Assets: This includes the total value of staked
            assets, accumulated rewards, and available balance.
          </div>
          <div className="divider-line"></div>
        </div>

        <StakingSummary
          availableAmount={availableAmount}
          stakedAmount={totalStakedAmount}
          unstakeAmount={totalUnStakedAmount}
          rewardsAmount={rewardsAmount}
        />
      </div>

      {/* Delegations */}
      <StakingDelegations isSingleChain={true} delegations={delegations} />

      {/* Unbonding */}
      {hasUnbondings ? (
        <StakingUnDelegations
          isSingleChain={true}
          undelegations={delegations}
        />
      ) : null}

      {/* Validator */}
      <ValidatorTable chainID={chainID} />
    </div>
  );
};
export default SingleStakingDashboard;
