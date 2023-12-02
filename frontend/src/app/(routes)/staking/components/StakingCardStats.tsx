import {
  StakingCardStatsProps,
  StakingCardsStatsItemProps,
} from '@/types/staking';
import { formatCoin, formatCommission } from '@/utils/util';
import React from 'react';

const StakingCardStats = ({
  delegated,
  rewards,
  commission,
  coinDenom,
}: StakingCardStatsProps) => {
  return (
    <div className="flex justify-between mt-4">
      <StakingCardStatsItem
        name={'Staked'}
        value={formatCoin(delegated, coinDenom)}
      />
      <StakingCardStatsItem
        name={'Rewards'}
        value={formatCoin(rewards, coinDenom)}
      />
      <StakingCardStatsItem
        name={'Commission'}
        value={formatCommission(commission)}
      />
    </div>
  );
};

export default StakingCardStats;

const StakingCardStatsItem = ({ name, value }: StakingCardsStatsItemProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="txt-sm font-extralight">{name}</div>
      <div className="txt-md font-bold">{value}</div>
    </div>
  );
};
