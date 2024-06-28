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
      type: 'Total Balance',
      amount: total,
    },
    {
      icon: '/staked-bal.png',
      alt: 'stake',
      type: 'Staked Amount',
      amount: staked,
    },
    {
      icon: '/rewards.png',
      alt: 'rewards',
      type: 'Rewards Received',
      amount: rewards,
    },
    {
      icon: '/avail-bal.png',
      alt: 'available',
      type: 'Available Balance',
      amount: available,
    },
  ];

  return (
    <div className="flex gap-6 w-full px-6 py-0">
      <div className="grid grid-cols-4 gap-4 w-full">
        {assetsSummaryData.map((data, index) => (
          <div key={index} className="dashboard-card">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center">
                <Image
                  src={data.icon}
                  width={40}
                  height={40}
                  alt={data.alt}
                  draggable={false}
                />
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="text-white text-xl font-bold leading-[18px]">
                  {data.amount?.split('.')[0]}
                  {Number(data.amount) > 0 ? (
                    <span className="text-[16px]">
                      .{data.amount?.split('.')[1]}
                    </span>
                  ) : null}
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
