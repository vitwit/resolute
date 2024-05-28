'use client';

import React from 'react';
// import StakingOverview from './components/StakingOverview';
// import StakingOverviewSidebar from './components/StakingOverviewSidebar';
import StakingDashboard from './components/StakingDashboard';

const Staking = () => {
  return (
    <div className="flex justify-between">
      {/* <StakingOverview />
      <StakingOverviewSidebar /> */}
      <StakingDashboard />
    </div>
  );
};

export default Staking;
