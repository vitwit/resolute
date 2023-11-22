'use client';

import { Validators } from '@/types/staking';
import { Avatar, Tooltip } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import Image from 'next/image';
import React, { useState } from 'react';
import DialogAllValidators from './DialogAllValidators';
import { formatVotingPower } from '@/utils/denom';

// TODO: Create css classes for repeated styles

const StakingSidebar = ({
  validators,
  currency,
}: {
  validators: Validators;
  currency: Currency;
}) => {
  return (
    <div className="staking-sidebar">
      <div className="flex flex-col gap-6">
        <div className="flex gap-10">
          <StakingStatsCard />
          <StakingStatsCard />
        </div>
        <div className="staking-sidebar-actions">
          <button className="staking-sidebar-actions-btn">Claim All</button>
          <button className="staking-sidebar-actions-btn">
            Claim and stake all
          </button>
        </div>
      </div>
      <div className="mt-10">
        <AllValidators validators={validators} currency={currency} />
      </div>
    </div>
  );
};

export default StakingSidebar;

const StakingStatsCard = () => {
  return (
    <div className="staking-stats-card w-full flex flex-col gap-2">
      <div className="flex items-center">
        <div className="w-10 h-10 flex-center-center">
          <Image
            src="/stake-icon.svg"
            height={24}
            width={24}
            alt="Staked Balance"
          />
        </div>
        <div className="text-sm text-white font-extralight leading-normal">
          Staked Balance
        </div>
      </div>
      <div className="px-2 text-lg font-bold leading-normal text-white">
        8768
      </div>
    </div>
  );
};

const AllValidators = ({
  validators,
  currency,
}: {
  validators: Validators;
  currency: Currency;
}) => {
  const [allValidatorsDialogOpen, setAllValidatorsDialogOpen] =
    useState<boolean>(false);
  const handleClose = () => {
    setAllValidatorsDialogOpen(
      (allValidatorsDialogOpen) => !allValidatorsDialogOpen
    );
  };
  const slicedValidatorsList = validators?.activeSorted.slice(0, 10);
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
        const commission =
          Number(
            validators.active[validator]?.commission?.commission_rates.rate
          ) * 100;
        const tokens = Number(validators.active[validator]?.tokens);

        return (
          <>
            <Validator
              key={index}
              moniker={moniker}
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
        currency={currency}
      />
    </div>
  );
};

const Validator = ({
  moniker,
  commission,
  tokens,
  currency,
}: {
  moniker: string;
  commission: number;
  tokens: number;
  currency: Currency;
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <div className="bg-[#fff] rounded-full">
          <Avatar sx={{ width: 40, height: 40, bgcolor: deepPurple[300] }} />
        </div>
        <div className="flex flex-col gap-2 w-[130px]">
          <div className="flex gap-2 items-center cursor-default">
            <Tooltip title={moniker} placement="top">
              <div className="text-[14px] font-light leading-3 truncate">
                {moniker}
              </div>
            </Tooltip>
            <Image
              src="/check-circle-icon.svg"
              height={16}
              width={16}
              alt="Check"
            />
          </div>
          <div className="text-[12px] text-[#FFFFFFBF] font-extralight leading-3">
            {formatVotingPower(tokens, currency.coinDecimals)}
          </div>
        </div>
      </div>
      <div className="text-[12px] text-[#FFFFFFBF] font-extralight leading-3">
        {commission.toFixed(2)}% Commission
      </div>
      <div>
        <button className="px-3 py-[6px] primary-gradient text-[12px] leading-[20px] rounded-lg font-medium">
          Delegate
        </button>
      </div>
    </div>
  );
};
