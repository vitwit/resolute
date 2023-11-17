import { dispayAmount } from '@/utils/util';
import Image from 'next/image';
import React from 'react';
type AssetSummary = { icon: string; alt: string; type: string; amount: string };

const WalletSummery = (props: {
  balanceAmount: number;
  stakedAmount: number;
  rewardsAmount: number;
}) => {
  const balanceAmount = dispayAmount(props.balanceAmount);
  const stakedAmount = dispayAmount(props.stakedAmount);
  const rewardsAmount = dispayAmount(props.rewardsAmount);
  const assetsSummaryData: AssetSummary[] = [
    {
      icon: 'stakesAmount.svg',
      alt: 'stake',
      type: 'Staked Amount',
      amount: stakedAmount,
    },
    {
      icon: 'rewardsAmount.svg',
      alt: 'rewards',
      type: 'Rewards',
      amount: rewardsAmount,
    },
    {
      icon: 'balanceAmount.svg',
      alt: 'balance',
      type: 'Wallet Balance',
      amount: balanceAmount,
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
        <div className="flex items-center justify-center px-2">
          <Image src={icon} width={24} height={24} alt={alt}></Image>
        </div>
        <div className="flex items-center">
          <div className="text-white text-sm font-extralight">{type}</div>
        </div>
      </div>
      <div className="ml-2 text-white text-2xl font-bold leading-[normal]">
        {amount}
      </div>
    </div>
  );
};

export default WalletSummery;
