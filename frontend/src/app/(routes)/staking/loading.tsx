'use client';

import PageLoading from '@/components/common/PageLoading';
import React from 'react';
import SummaryLoading from './components/loaders/SummaryLoading';
import UnbondingLoading from './components/loaders/UnbondingLoading';
import DelegationsLoading from './components/loaders/DelegationsLoading';

const loading = () => (
  <>
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
      {/* Unbonding */}
      <UnbondingLoading />
      {/* Delegations */}
      <DelegationsLoading />
    </div>
  </>
);

export default loading;
