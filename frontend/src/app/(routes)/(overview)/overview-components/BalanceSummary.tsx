import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { formatDollarAmount } from '@/utils/util';
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
      type: 'Staked Amt',
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
    <div className="portfolio-bg gap-6">
      <div className="flex flex-col gap-1">
        <div className="text-h2">Portfolio</div>
        <div className="flex flex-col gap-2">
          <div className="secondary-text">Summary of assets information </div>
          <div className="divider-line"></div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6 w-full">
        {assetsSummaryData.map((data, index) => (
          <div key={index} className="portfolio-card">
            <div className="flex flex-col space-y-2 items-center">
              <div className="secondary-text">{data.type}</div>
              <div className="text-[18px] font-bold leading-[27px]">
                {data.amount?.split('.')[0]}
                {Number(data.amount) > 0 ? (
                  <span className="text-[16px]">
                    .{data.amount?.split('.')[1]}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
