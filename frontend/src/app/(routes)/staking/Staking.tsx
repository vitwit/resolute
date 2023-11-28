'use client';

import React from 'react';
import StakingOverview from './components/StakingOverview';
import StakingOverviewSidebar from './components/StakingOverviewSidebar';

const Staking = () => {
  return (
    <div className="flex justify-between">
      <StakingOverview />
      <StakingOverviewSidebar />
    </div>
  );
};

export default Staking;
