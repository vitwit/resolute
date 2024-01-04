import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { ChainUnbondingsProps, Validator } from '@/types/staking';
import React, { useEffect, useState } from 'react';
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
  const [allValidators, setAllValidators] = useState<Record<string, Validator>>(
    {}
  );

  useEffect(() => {
    setAllValidators({ ...validators?.active, ...validators?.inactive });
  }, [validators]);

  return (
    <>
      {unbondings?.unbonding_responses?.map((row) => {
        const entries = row.entries;
        return entries.map((entry) => {
          return (
            <UnbondingCard
              key={row.validator_address + entry.completion_time}
              moniker={
                allValidators?.[row.validator_address]?.description.moniker
              }
              identity={
                allValidators?.[row.validator_address]?.description.identity
              }
              validatorAddress={row.validator_address}
              chainName={chainName}
              amount={parseDenomAmount(entry.balance, currency.coinDecimals)}
              currency={currency}
              networkLogo={networkLogo}
              completionTime={entry.completion_time}
              creationHeight={entry.creation_height}
              chainID={chainID}
            />
          );
        });
      })}
    </>
  );
};

export default ChainUnbondings;
