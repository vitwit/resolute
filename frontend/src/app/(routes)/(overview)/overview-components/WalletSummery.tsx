import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import { formatDollarAmount } from '@/utils/util';
import Image from 'next/image';
import React from 'react';
import useGetAuthzAssetsAmount from '../../../../custom-hooks/useGetAuthzAssetsAmount';
type AssetSummary = { icon: string; alt: string; type: string; amount: string };

const WalletSummery = ({ chainIDs }: { chainIDs: string[] }) => {
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
  const assetsSummaryData: AssetSummary[] = [
    {
      icon: '/stakesAmount.svg',
      alt: 'stake',
      type: 'Staked Amount',
      amount: staked,
    },
    {
      icon: '/rewardsAmount.svg',
      alt: 'rewards',
      type: 'Rewards',
      amount: rewards,
    },
    {
      icon: '/balanceAmount.svg',
      alt: 'available',
      type: 'Available',
      amount: available,
    },
  ];

  return (
    <div className="w-full summary-cards-container">
      {assetsSummaryData.map((assetTypeData) => (
        <WalletSummaryCard
          key={assetTypeData.type}
          icon={assetTypeData.icon}
          alt={assetTypeData.alt}
          amount={assetTypeData.amount}
          type={assetTypeData.type}
        />
      ))}
    </div>
  );
};

const WalletSummaryCard = (props: AssetSummary) => {
  const { type, icon, amount, alt } = props;
  return (
    <div className="summary-card">
      <div className="flex w-full h-10">
        <div className="flex items-center justify-center p-2">
          <Image src={icon} width={24} height={24} alt={alt}></Image>
        </div>
        <div className="flex items-center">
          <div className="text-sm not-italic font-normal leading-[normal]">
            {type}
          </div>
        </div>
      </div>
      <div className="ml-2 text-base not-italic font-bold leading-[normal]">
        {amount}
      </div>
    </div>
  );
};

export default WalletSummery;
