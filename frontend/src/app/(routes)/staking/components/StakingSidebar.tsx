'use client';

import {
  StakingMenuAction,
  StakingSidebarProps,
  ValidatorItemProps,
  Validators,
} from '@/types/staking';
import { CircularProgress, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import DialogAllValidators from './DialogAllValidators';
import { formatVotingPower } from '@/utils/denom';
import ValidatorLogo from './ValidatorLogo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { formatStakedAmount } from '@/utils/util';
import StakingStatsCard from './StakingStatsCard';
import TopNav from '@/components/TopNav';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { txWithdrawAllRewards } from '@/store/features/distribution/distributionSlice';
import { TxStatus } from '@/types/enums';
import { txRestake } from '@/store/features/staking/stakeSlice';
import { setError } from '@/store/features/common/commonSlice';

interface AllValidatorsProps {
  validators: Validators;
  currency: Currency;
  onMenuAction: StakingMenuAction;
  validatorsStatus: TxStatus;
}

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
          message: 'A claim transaction is already in pending',
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
          message: 'On Delegations',
        })
      );
    }
  };

  const claimAndStake = (chainID: string) => {
    if (txRestakeStatus === TxStatus.PENDING) {
      dispatch(
        setError({
          type: 'error',
          message: 'A restake transaction is already pending',
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
          message: 'No rewards',
        })
      );
    }
  };

  return (
    <div className="staking-sidebar flex flex-col">
      <div className="flex flex-col gap-6">
        <TopNav />
        <div className="flex gap-10">
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

const AllValidators = ({
  validators,
  currency,
  onMenuAction,
  validatorsStatus,
}: AllValidatorsProps) => {
  const [allValidatorsDialogOpen, setAllValidatorsDialogOpen] =
    useState<boolean>(false);
  const handleClose = () => {
    setAllValidatorsDialogOpen(false);
  };
  const slicedValidatorsList = validators?.activeSorted.slice(0, 10) || [];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] leading-normal font-bold">All Validators</h2>
        {validatorsStatus === TxStatus.IDLE ? (
          <div
            className="cursor-pointer text-[#FFFFFFBF] text-[12px] font-extralight underline underline-offset-2"
            onClick={() => setAllValidatorsDialogOpen(true)}
          >
            View All
          </div>
        ) : null}
      </div>
      {validatorsStatus === TxStatus.PENDING ? (
        <div className="text-center mt-16">
          <CircularProgress size={32} />
        </div>
      ) : (
        <>
          {slicedValidatorsList.map((validator) => {
            const { moniker, identity } =
              validators.active[validator]?.description;
            const commission =
              Number(
                validators.active[validator]?.commission?.commission_rates.rate
              ) * 100;
            const tokens = Number(validators.active[validator]?.tokens);
            return (
              <ValidatorItem
                key={validator}
                moniker={moniker}
                identity={identity}
                commission={commission}
                tokens={tokens}
                currency={currency}
                onMenuAction={onMenuAction}
                validators={validators}
                validator={validator}
              />
            );
          })}
        </>
      )}
      <DialogAllValidators
        handleClose={handleClose}
        open={allValidatorsDialogOpen}
        validators={validators}
        onMenuAction={onMenuAction}
      />
    </div>
  );
};

const ValidatorItem = ({
  moniker,
  identity,
  commission,
  tokens,
  currency,
  onMenuAction,
  validators,
  validator,
}: ValidatorItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <div className="bg-[#fff] rounded-full">
          <ValidatorLogo identity={identity} height={40} width={40} />
        </div>
        <div className="flex flex-col justify-center gap-2 w-[130px]">
          <div className="flex gap-2 items-center cursor-default">
            <Tooltip title={moniker} placement="top">
              <div className="text-[14px] font-light leading-3 truncate">
                {moniker}
              </div>
            </Tooltip>
          </div>
          <div className="text-[12px] text-[#FFFFFFBF] font-extralight leading-3">
            {formatVotingPower(tokens, currency.coinDecimals)}
          </div>
        </div>
      </div>
      <div className="text-[12px] text-[#FFFFFFBF] font-extralight leading-3">
        {commission ? String(commission.toFixed(0)) + '%' : '-'} Commission
      </div>
      <div>
        <button
          className="primary-gradient sidebar-delegate-button"
          onClick={() => onMenuAction('delegate', validators.active[validator])}
        >
          Delegate
        </button>
      </div>
    </div>
  );
};
