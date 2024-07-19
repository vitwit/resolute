'use client';

import useSingleStaking from '@/custom-hooks/useSingleStaking';
import StakingSummary from '../components/StakingSummary';
import StakingUnDelegations from '../components/StakingUnDelegations';
import StakingDelegations from '../components/StakingDelegations';
import ValidatorTable from '../components/ValidatorTable';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import useInitStaking from '@/custom-hooks/useInitStaking';
import NewDelegationDialog from '../components/NewDelegationDialog';
import PageHeader from '@/components/common/PageHeader';
import CustomButton from '@/components/common/CustomButton';
import { useState } from 'react';

const SingleStakingDashboard = ({ chainID }: { chainID: string }) => {
  useInitStaking(chainID);
  const staking = useSingleStaking(chainID);
  const {
    totalStakedAmount,
    rewardsAmount,
    totalUnStakedAmount,
    availableAmount,
  } = staking.getStakingAssets();
  const delegations = staking.getAllDelegations(chainID);
  const [newDelegationOpen, setNewDelegationOpen] = useState(false);
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const stakingData = useAppSelector((state) => state.staking.chains);
  const authzStakingData = useAppSelector(
    (state) => state.staking.authz.chains
  );
  const hasUnbondings = isAuthzMode
    ? authzStakingData[chainID]?.unbonding?.hasUnbonding
    : stakingData[chainID]?.unbonding.hasUnbonding;
  const hasDelegations =
    stakingData?.[chainID]?.delegations?.delegations?.delegation_responses
      ?.length;

  return (
    <div className="flex flex-col items-start gap-10 w-full py-10">
      <div className="flex flex-col w-full gap-6">
        <div className="flex items-end gap-6">
          <div className="flex-1">
            <PageHeader
              description="  Summary of Staked Assets: This includes the total value of staked
        assets, accumulated rewards, and available balance."
              title="Staking"
            />
          </div>
          {hasDelegations ? (
            <CustomButton
              btnText="New Delegation"
              btnOnClick={() => {
                setNewDelegationOpen(true);
              }}
            />
          ) : null}
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
      <NewDelegationDialog
        chainID={chainID}
        onClose={() => {
          setNewDelegationOpen(false);
        }}
        open={newDelegationOpen}
      />
    </div>
  );
};
export default SingleStakingDashboard;
