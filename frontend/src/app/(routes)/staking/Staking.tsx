import React from 'react';
import StakingOverview from './components/StakingOverview';
import StakingSidebar from './components/StakingSidebar';

const Staking = () => {
  return (
    <div className="flex justify-between">
      <StakingOverview />
      <StakingSidebar />
    </div>
  );
};

export default Staking;
