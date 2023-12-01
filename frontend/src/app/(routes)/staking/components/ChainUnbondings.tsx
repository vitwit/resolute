import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { ChainUnbondingsProps } from '@/types/staking';
import React from 'react';
import UnbondingCard from './UnbondingCard';
import { parseDenomAmount } from '@/utils/util';

//TODO: Add cancelUnbondingDelegation msg and reducer

const ChainUnbondings = ({
  chainID,
  unbondings,
  validators,
  currency,
  chainName,
}: ChainUnbondingsProps) => {
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const networkLogo = networks[chainID]?.network?.logos?.menu;

  return (
    <>
      {unbondings?.unbonding_responses?.map((row) => {
        const entries = row.entries;
        return entries.map((entry) => {
          return (
            <UnbondingCard
              key={row.validator_address + entry.completion_time}
              validator={
                validators?.active?.[row.validator_address]?.description.moniker
              }
              identity={
                validators?.active?.[row.validator_address]?.description.identity
              }
              chainName={chainName}
              amount={parseDenomAmount(entry.balance, currency.coinDecimals)}
              currency={currency}
              networkLogo={networkLogo}
              completionTime={entry.completion_time}
            />
          );
        });
      })}
    </>
  );
};

export default ChainUnbondings;
