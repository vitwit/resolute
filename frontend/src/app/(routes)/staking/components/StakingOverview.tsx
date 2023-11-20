'use client';

import React from 'react';
import './../staking.css';
import StakingCard from './StakingCard';
import UnbondingCard from './UnbondingCard';

const StakingOverview = () => {
  const arr = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  return (
    <div className="p-10 flex-1 h-screen min-h-[800px] overflow-y-scroll no-scrollbar">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {arr.map((item, index) => (
          <>
            <StakingCard key={index} />
          </>
        ))}
      </div>

      <div>
        <h2 className="txt-lg font-medium my-6">Unbonding</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {arr.map((item, index) => (
            <>
              <UnbondingCard key={index} />
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StakingOverview;
