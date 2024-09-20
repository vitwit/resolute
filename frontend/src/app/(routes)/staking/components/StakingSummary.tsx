import NumberFormat from '@/components/common/NumberFormat';

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
  const total = stakedAmount + rewardsAmount + unstakeAmount + availableAmount;

  const assetsSummaryData: AssetSummary[] = [
    {
      icon: '/staked-bal.png',
      alt: 'stake',
      type: 'Total Amount',
      amount: total?.toString(),
    },
    {
      icon: '/total-bal.png',
      alt: 'available',
      type: 'Staked Amount',
      amount: stakedAmount?.toString(),
    },
    {
      icon: '/rewards.png',
      alt: 'rewards',
      type: 'Rewards',
      amount: rewardsAmount?.toString(),
    },

    {
      icon: '/avail-bal.png',
      alt: 'Avail-bal-icon',
      type: 'Available Balance',
      amount: availableAmount?.toString(),
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-6">
      <div className="flex justify-between w-full gap-10">
        {assetsSummaryData.map((data, index) => (
          <div key={index} className="staking-summary-card">
            <div className="flex flex-col items-center space-y-2">
              <div className="secondary-text">{data.type}</div>
              <div className="text-[18px] font-bold leading-[27px]">
                <NumberFormat type="dollar" value={data.amount} cls="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StakingSummary;
