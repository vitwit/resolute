import { formatDollarAmount } from '@/utils/util';
import Image from 'next/image';
import React from 'react';

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
          <StakingStatsCard totalStakedAmount={totalStakedAmount} />
          <StakingStatsCard totalStakedAmount={totalStakedAmount} />
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

const StakingStatsCard = ({
  totalStakedAmount,
}: {
  totalStakedAmount: number;
}) => {
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
        {formatDollarAmount(totalStakedAmount)}
      </div>
    </div>
  );
};
