import React from 'react';
import ValidatorTableLoading from './loaders/ValidatorTableLoading';
import SummaryLoading from './loaders/SummaryLoading';
import UnbondingLoading from './loaders/UnbondingLoading';
import DelegationsLoading from './loaders/DelegationsLoading';

const StakingLoading = () => {
  return (
    <div className="flex flex-col items-start gap-20 w-full px-10 py-20">
      <div className="flex flex-col gap-10">
        <div className="space-y-2 items-start w-full">
          <div className="text-h1">Staking</div>
          <div className="secondary-text">
            Here&apos;s an overview of your staked assets, including delegation
            and undelegation details, and your total staked balance.
          </div>
          <div className="horizontal-line"></div>
        </div>

        {/* Staking Summary */}
        <SummaryLoading />
      </div>

      {/* Delegations */}
      <DelegationsLoading />

      {/* Unbonding */}
      <UnbondingLoading />

      {/* Validator table */}
      <ValidatorTableLoading />
    </div>
  );
};

export default StakingLoading;
