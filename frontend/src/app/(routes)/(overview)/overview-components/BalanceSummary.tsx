import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { formatDollarAmount } from '@/utils/util';
import Image from 'next/image';
import React from 'react';
import useGetAuthzAssetsAmount from '../../../../custom-hooks/useGetAuthzAssetsAmount';
type AssetSummary = { icon: string; alt: string; type: string; amount: string };

export default function BalanceSummary({ chainIDs }: { chainIDs: string[] }) {
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const [myStaked, myAvailable, myRewards] = useGetAssetsAmount(chainIDs);

  const [authzStaked, authzAvailable, authzRewards] =
    useGetAuthzAssetsAmount(chainIDs);

  const stakedAmount = isAuthzMode ? authzStaked : myStaked;
  const availableAmount = isAuthzMode ? authzAvailable : myAvailable;
  const rewardsAmount = isAuthzMode ? authzRewards : myRewards;

  const available = formatDollarAmount(availableAmount);
  const staked = formatDollarAmount(stakedAmount);
  const rewards = formatDollarAmount(rewardsAmount);
  const total = formatDollarAmount(
    stakedAmount + availableAmount + rewardsAmount
  );

  const assetsSummaryData: AssetSummary[] = [
    {
      icon: '/total-bal.png',
      alt: 'total-balance',
      type: 'TotalBalance',
      amount: total,
    },
    {
      icon: '/staked-bal.png',
      alt: 'stake',
      type: 'StakedAmt',
      amount: staked,
    },
    {
      icon: '/rewards.png',
      alt: 'rewards',
      type: 'Rewards',
      amount: rewards,
    },
    {
      icon: '/avail-bal.png',
      alt: 'available',
      type: 'Balance',
      amount: available,
    },
  ];

  return (
    <div className="portfolio-bg gap-4">
      <div className="gap-2 flex flex-col">
        <div className="text-h2">Portfolio</div>
        <div className="secondary-text">
          Connect your wallet now to access all the modules on resolute{' '}
        </div>
        <div className="divider-line"></div>
      </div>
      <div className="grid grid-cols-4 gap-6 w-full">
        {assetsSummaryData.map((data, index) => (
          <div key={index} className="portfolio-card">
            <div className="flex flex-col gap-4">
              <div className="text-[#ffffffad] text-xl font-bold leading-[18px]">
                {data.amount?.split('.')[0]}
                {Number(data.amount) > 0 ? (
                  <span className="text-[16px]">
                    .{data.amount?.split('.')[1]}
                  </span>
                ) : null}
              </div>
              <div className="flex gap-1 items-center">
                <Image
                  src={data.icon}
                  width={24}
                  height={24}
                  alt={data.alt}
                  draggable={false}
                />
                <div className="secondary-text">{data.type}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
