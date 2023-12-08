'use client';

import { StakingSidebarProps } from '@/types/staking';
import { CircularProgress } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import StakingStatsCard from './StakingStatsCard';
import TopNav from '@/components/TopNav';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { txWithdrawAllRewards } from '@/store/features/distribution/distributionSlice';
import { TxStatus } from '@/types/enums';
import { txRestake } from '@/store/features/staking/stakeSlice';
import { setError } from '@/store/features/common/commonSlice';
import AllValidators from './AllValidators';
import { formatStakedAmount } from '@/utils/util';
import {
  NO_DELEGATIONS_ERROR,
  NO_REWARDS_ERROR,
  TXN_PENDING_ERROR,
} from '@/utils/errors';

const StakingSidebar = ({
  validators,
  currency,
  chainID,
  onMenuAction,
}: StakingSidebarProps) => {
  const stakedBalance = useAppSelector(
    (state: RootState) =>
      state.staking.chains?.[chainID]?.delegations.totalStaked || 0
  );
  const totalRewards = useAppSelector(
    (state: RootState) =>
      state.distribution.chains?.[chainID]?.delegatorRewards.totalRewards || 0
  );
  const tokens = [
    {
      amount: stakedBalance.toString(),
      denom: currency.coinMinimalDenom,
    },
  ];
  const rewardTokens = [
    {
      amount: parseInt(totalRewards.toString()).toString(),
      denom: currency.coinMinimalDenom,
    },
  ];

  const txClaimStatus = useAppSelector(
    (state: RootState) => state.distribution.chains[chainID]?.tx.status
  );
  const txRestakeStatus = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.reStakeTxStatus
  );
  const validatorsStatus = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.validators.status
  );

  const dispatch = useAppDispatch();
  const { txWithdrawAllRewardsInputs, txRestakeInputs } = useGetTxInputs();

  const claim = (chainID: string) => {
    if (txClaimStatus === TxStatus.PENDING) {
      dispatch(
        setError({
          type: 'error',
          message: TXN_PENDING_ERROR('Claim'),
        })
      );
      return;
    }
    const txInputs = txWithdrawAllRewardsInputs(chainID);
    if (txInputs.msgs.length) dispatch(txWithdrawAllRewards(txInputs));
    else {
      dispatch(
        setError({
          type: 'error',
          message: NO_DELEGATIONS_ERROR,
        })
      );
    }
  };

  const claimAndStake = (chainID: string) => {
    if (txRestakeStatus === TxStatus.PENDING) {
      dispatch(
        setError({
          type: 'error',
          message: TXN_PENDING_ERROR('Restake'),
        })
      );
      return;
    }
    const txInputs = txRestakeInputs(chainID);
    if (txInputs.msgs.length) dispatch(txRestake(txInputs));
    else {
      dispatch(
        setError({
          type: 'error',
          message: NO_REWARDS_ERROR,
        })
      );
    }
  };

  return (
    <div className="staking-sidebar flex flex-col">
      <div className="flex flex-col gap-6">
        <TopNav />
        <div className="flex gap-6">
          <StakingStatsCard
            name={'Staked Balance'}
            value={formatStakedAmount(tokens, currency)}
          />
          <StakingStatsCard
            name={'Rewards'}
            value={formatStakedAmount(rewardTokens, currency)}
          />
        </div>
        <div className="staking-sidebar-actions">
          <button
            className="staking-sidebar-actions-btn"
            onClick={() => claim(chainID)}
          >
            {txClaimStatus === TxStatus.PENDING ? (
              <CircularProgress size={16} sx={{ color: 'purple' }} />
            ) : (
              'Claim All'
            )}
          </button>
          <button
            className="staking-sidebar-actions-btn"
            onClick={() => claimAndStake(chainID)}
          >
            {txRestakeStatus === TxStatus.PENDING ? (
              <CircularProgress size={16} sx={{ color: 'purple' }} />
            ) : (
              'Claim & Stake All'
            )}
          </button>
        </div>
      </div>
      <div className="mt-10 flex-1 overflow-y-scroll">
        <AllValidators
          validators={validators}
          currency={currency}
          onMenuAction={onMenuAction}
          validatorsStatus={validatorsStatus}
        />
      </div>
    </div>
  );
};

export default StakingSidebar;
