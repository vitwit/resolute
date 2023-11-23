import { formatDollarAmount } from '@/utils/util';
import Image from 'next/image';
import React from 'react';
import StakingStatsCard from './StakingStatsCard';

// TODO: Create css classes for repeated styles

const StakingOverviewSidebar = ({
  totalStakedAmount,
}: {
  totalStakedAmount: number;
}) => {
  return (
    <div className="staking-sidebar">
      <div className="flex flex-col gap-6">
        <div className="flex gap-10">
          <StakingStatsCard
            name={'Staked Balance'}
            value={formatDollarAmount(totalStakedAmount)}
          />
          {/* TODO: Send total rewards as prop  */}
          <StakingStatsCard name={'Rewards'} value={'0'} />
        </div>
        <div className="staking-sidebar-actions">
          <button className="staking-sidebar-actions-btn">Claim All</button>
          <button className="staking-sidebar-actions-btn">
            Claim and stake all
          </button>
        </div>
      </div>
      <div className="mt-10 space-y-10">
        <Image
          src="https://dummyimage.com/445X166/000/fff&text=Ad1"
          width={445}
          height={166}
          alt="Ad"
        />
        <Image
          src="https://dummyimage.com/445X312/000/fff&text=Ad2"
          width={445}
          height={166}
          alt="Ad"
        />
      </div>
    </div>
  );
};

export default StakingOverviewSidebar;
