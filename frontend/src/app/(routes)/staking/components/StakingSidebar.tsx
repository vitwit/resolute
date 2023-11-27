'use client';

import { Validator, Validators } from '@/types/staking';
import { Tooltip } from '@mui/material';
import React, { useState } from 'react';
import DialogAllValidators from './DialogAllValidators';
import { formatVotingPower, parseBalance } from '@/utils/denom';
import ValidatorLogo from './ValidatorLogo';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { formatCoin } from '@/utils/util';
import StakingStatsCard from './StakingStatsCard';

const StakingSidebar = ({
  validators,
  currency,
  chainID,
  onMenuAction,
}: {
  validators: Validators;
  currency: Currency;
  chainID: string;
  onMenuAction: (type: string, validator: Validator) => void;
}) => {
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
  return (
    <div className="staking-sidebar">
      <div className="flex flex-col gap-6">
        <div className="flex gap-10">
          <StakingStatsCard
            name={'Staked Balance'}
            value={formatCoin(
              parseBalance(
                tokens,
                currency.coinDecimals,
                currency.coinMinimalDenom
              ),
              currency.coinDenom
            )}
          />
          <StakingStatsCard
            name={'Rewards'}
            value={formatCoin(
              parseBalance(
                rewardTokens,
                currency.coinDecimals,
                currency.coinMinimalDenom
              ),
              currency.coinDenom
            )}
          />
        </div>
        <div className="staking-sidebar-actions">
          <button className="staking-sidebar-actions-btn">Claim All</button>
          <button className="staking-sidebar-actions-btn">
            Claim and stake all
          </button>
        </div>
      </div>
      <div className="mt-10">
        <AllValidators
          validators={validators}
          currency={currency}
          onMenuAction={onMenuAction}
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
}: {
  validators: Validators;
  currency: Currency;
  onMenuAction: (type: string, validator: Validator) => void;
}) => {
  const [allValidatorsDialogOpen, setAllValidatorsDialogOpen] =
    useState<boolean>(false);
  const handleClose = () => {
    setAllValidatorsDialogOpen(
      (allValidatorsDialogOpen) => !allValidatorsDialogOpen
    );
  };
  const slicedValidatorsList = validators?.activeSorted.slice(0, 10) || [];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] leading-normal font-bold">All Validators</h2>
        <div
          className="cursor-pointer text-[#FFFFFFBF] text-[12px] font-extralight underline underline-offset-2"
          onClick={() => setAllValidatorsDialogOpen(true)}
        >
          View All
        </div>
      </div>
      {slicedValidatorsList.map((validator, index) => {
        const moniker = validators.active[validator]?.description.moniker;
        const identity = validators.active[validator]?.description.identity;
        const commission =
          Number(
            validators.active[validator]?.commission?.commission_rates.rate
          ) * 100;
        const tokens = Number(validators.active[validator]?.tokens);

        return (
          <>
            <ValidatorItem
              key={index}
              moniker={moniker}
              identity={identity}
              commission={commission}
              tokens={tokens}
              currency={currency}
            />
          </>
        );
      })}
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
}: {
  moniker: string;
  identity: string;
  commission: number;
  tokens: number;
  currency: Currency;
}) => {
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
        {commission ? String(commission) + '%' : '-'} Commission
      </div>
      <div>
        <button className="px-3 py-[6px] primary-gradient text-[12px] leading-[20px] rounded-lg font-medium">
          Delegate
        </button>
      </div>
    </div>
  );
};
