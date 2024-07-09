import { formatDollarAmount } from '@/utils/util';

import React from 'react';

type AssetSummary = { icon: string; alt: string; type: string; amount: string };

function StakingSummary({
  stakedAmount,
  rewardsAmount,
  unstakeAmount,
  availableAmount,
}: {
  stakedAmount: number;
  rewardsAmount: number;
  unstakeAmount: number;
  availableAmount: number;
}) {
  const assetsSummaryData: AssetSummary[] = [
    {
      icon: '/staked-bal.png',
      alt: 'stake',
      type: 'Total Staking',
      amount: formatDollarAmount(stakedAmount),
    },
    {
      icon: '/total-bal.png',
      alt: 'available',
      type: 'Staked Amount',
      amount: formatDollarAmount(availableAmount),
    },
    {
      icon: '/rewards.png',
      alt: 'rewards',
      type: 'Rewards',
      amount: formatDollarAmount(rewardsAmount),
    },

    {
      icon: '/avail-bal.png',
      alt: 'Avail-bal-icon',
      type: 'Available Balance',
      amount: formatDollarAmount(unstakeAmount),
      // amount: parseInt(stakedBal)+rewardsBal+availableBal,
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-6">
      <div className="flex justify-between w-full gap-10">
        {assetsSummaryData.map((data, index) => (
          <div key={index} className="staking-summary-card">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-small-light">{data.type}</div>
              <div className="text-xl font-bold leading-[18px]">
                {data?.amount?.split('.')[0]}
                {Number(data.amount) > 0
                  ? '.' +
                    (
                      <span className="text-[16px] font-bold">
                        {data?.amount.split('.')[1]}
                      </span>
                    )
                  : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="divider-line"></div> */}
    </div>
  );
}

export default StakingSummary;
