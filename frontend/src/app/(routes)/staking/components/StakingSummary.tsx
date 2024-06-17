import Image from 'next/image';
import React from 'react';

type AssetSummary = { icon: string; alt: string; type: string; amount: number };

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
      amount: stakedAmount,
    },
    {
      icon: '/total-bal.png',
      alt: 'available',
      type: 'Staked Amount',
      amount: availableAmount,
    },
    {
      icon: '/rewards.png',
      alt: 'rewards',
      type: 'Rewards',
      amount: rewardsAmount,
    },

    {
      icon: '/avail-bal.png',
      alt: 'Avail-bal-icon',
      type: 'Available Balance',
      amount: unstakeAmount,
      // amount: parseInt(stakedBal)+rewardsBal+availableBal,
    },
  ];

  return (
    <div className="flex gap-6 w-full px-6 py-0">
      <div className="grid grid-cols-4 gap-4 w-full">
        {assetsSummaryData.map((data, index) => (
          <div key={index} className="dashboard-card">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center">
                <Image src={data.icon} width={40} height={40} alt={data.alt} />
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="text-white text-xl font-bold leading-[18px]">
                  $ {data?.amount?.toFixed(3)}
                </div>
                <div className="text-small-light">{data.type}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StakingSummary;
