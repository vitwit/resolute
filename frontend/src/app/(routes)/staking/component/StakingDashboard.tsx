'use client';

import ValidatorTable from './ValidatorTable';
import StakingDelegations from './StakingDelegations';
import StakingUnDelegations from './StakingUnDelegations';
import StakingSummary from './StakingSummary';
import useStaking from '@/custom-hooks/useStaking';

const StakingDashbrd = () => {
  const staking = useStaking();

  const { totalStakedAmount, rewardsAmount, totalUnStakedAmount } = staking.getStakingAssets()

  return (
    <div className="flex flex-col items-start gap-20 flex-[1_0_0] self-stretch px-10 py-20">
      <div className="flex flex-col w-full gap-10">
        <div className="space-y-2 items-start">
          <div className="text-white text-[28px] not-italic font-bold leading-[normal]">
            Staking
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
            Connect your wallet now to access all the modules on resolute{' '}
          </div>
          <div className="horizontal-line"></div>
        </div>

        {/* Staking summary */}
        <StakingSummary stakedAmount={totalStakedAmount}
          unstakeAmount={totalUnStakedAmount}
          rewardsAmount={rewardsAmount} />
      </div>

      {/* Unbonding */}
      <StakingUnDelegations />

      {/* Delegations */}
      <StakingDelegations />

      {/* Validator */}
      <ValidatorTable />
    </div>
  );
};
export default StakingDashbrd;
