import React from 'react';
import { StakingCardHeader } from './StakingCard';

const UnbondingCard = () => {
  return (
    <div className="unbonding-card">
      <StakingCardHeader
        validator={'Stakefish'}
        validatorLogo={'/stake-fish-icon.png'}
        network={'CosmosHub'}
        networkLogo={'/cosmos-icon.svg'}
      />
      <UnbodingCardStats unbodingPeriod={21} amount={2.5} coinDenom={'OSMO'} />
      <div>
        <button className="primary-gradient cancel-unbonding-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UnbondingCard;

const UnbodingCardStats = ({
  unbodingPeriod,
  amount,
  coinDenom,
}: {
  unbodingPeriod: number;
  amount: number;
  coinDenom: string;
}) => {
  return (
    <div className="flex justify-between">
      <UnbondingCardStatsItem
        name={'Available in'}
        value={String(unbodingPeriod) + ' ' + 'Days'}
      />
      <UnbondingCardStatsItem
        name={'Amount'}
        value={String(amount) + ' ' + coinDenom}
      />
    </div>
  );
};


export const UnbondingCardStatsItem = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="txt-sm font-extralight text-right">{name}</div>
        <div className="txt-md font-bold">{value}</div>
      </div>
    );
  };
