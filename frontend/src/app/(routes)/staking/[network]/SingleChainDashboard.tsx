'use client';

// import ValidatorTable from './ValidatorTable';
import StakingDelegations from '../component/StakingDelegations';
import StakingUnDelegations from '../component/StakingUnDelegations';
import StakingSummary from '../component/StakingSummary';
import useSingleStaking from '@/custom-hooks/useSingleStaking';
import ValidatorTable from '../component/ValidatorTable';
// import { RootState } from '@/store/store';
// import { useAppSelector } from '@/custom-hooks/StateHooks';

const SingleStakingDashboard = ({ chainID }: { chainID: string }) => {
  const staking = useSingleStaking(chainID);
  const { totalStakedAmount, rewardsAmount, totalUnStakedAmount, availableAmount } = staking.getStakingAssets()
  const delegations = staking.getAllDelegations(chainID)

  return (
    <div className="flex flex-col items-start gap-20 flex-[1_0_0] self-stretch px-10 py-20">
      <div className="flex flex-col w-full gap-10">
        <div className="space-y-2 items-start">
          <div className="text-white text-[28px] not-italic font-bold leading-[normal]">
            Staking
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
            Summary of Staked Assets: This includes the total value of staked assets, accumulated rewards, and available balance.
          </div>
          <div className="horizontal-line"></div>
        </div>

        <StakingSummary
          availableAmount={availableAmount}
          stakedAmount={totalStakedAmount}
          unstakeAmount={totalUnStakedAmount}
          rewardsAmount={rewardsAmount} />
      </div>

      {/* Unbonding */}
      <StakingUnDelegations isSingleChain={true} undelegations={delegations} />

      {/* Delegations */}
      <StakingDelegations isSingleChain={true} delegations={delegations} />

      {/* Validator */}
      <ValidatorTable chainID={chainID} />
    </div>
  );
};
export default SingleStakingDashboard;
