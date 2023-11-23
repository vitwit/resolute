import React from 'react';
import { StakingCardHeader } from './StakingCard';
import { formatCoin, getDaysLeftString } from '@/utils/util';
import { getDaysLeft } from '@/utils/datetime';
import { Tooltip } from '@mui/material';

const UnbondingCard = ({
  validator,
  identity,
  chainName,
  amount,
  networkLogo,
  currency,
  completionTime,
}: {
  validator: string;
  identity: string;
  chainName: string;
  amount: number;
  networkLogo: string;
  currency: Currency;
  completionTime: string;
}) => {
  return (
    <div className="unbonding-card">
      <StakingCardHeader
        validator={validator}
        identity={identity}
        network={chainName}
        networkLogo={networkLogo}
      />
      <UnbodingCardStats
        completionTime={completionTime}
        amount={amount}
        coinDenom={currency.coinDenom}
      />
      <div>
        <Tooltip title="Cancel unbonding" placement="right">
          <button className="primary-gradient cancel-unbonding-btn">
            Cancel
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default UnbondingCard;

const UnbodingCardStats = ({
  completionTime,
  amount,
  coinDenom,
}: {
  completionTime: string;
  amount: number;
  coinDenom: string;
}) => {
  const daysLeft = getDaysLeft(completionTime);
  return (
    <div className="flex justify-between">
      <UnbondingCardStatsItem
        name={'Available in'}
        value={getDaysLeftString(daysLeft)}
      />
      <UnbondingCardStatsItem
        name={'Amount'}
        value={formatCoin(amount, coinDenom)}
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
