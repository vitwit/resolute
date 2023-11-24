import { formatDollarAmount } from '@/utils/util';
import Image from 'next/image';
import React from 'react';
import StakingStatsCard from './StakingStatsCard';

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
          {/* TODO: Send total rewards as prop to value */}
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
          className="cursor-pointer"
          src="/staking-ad-1.png"
          width={445}
          height={166}
          alt="Ad"
        />
        <Image
          className="cursor-pointer"
          src="/staking-ad-2.png"
          width={445}
          height={312}
          alt="Ad"
        />
      </div>
    </div>
  );
};

export default StakingOverviewSidebar;
