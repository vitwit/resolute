'use client';
import { GetDelegationsResponse, Validators } from '@/types/staking';
import React from 'react';
import StakingCard from './StakingCard';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';

const ChainDelegations = ({
  chainID,
  delegations,
  validators,
  currency,
  chainName,
}: {
  chainID: string;
  chainName: string;
  delegations: GetDelegationsResponse;
  validators: Validators;
  currency: Currency;
}) => {
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const networkLogo = networks[chainID].network.logos.menu;

  return (
    <>
      {delegations?.delegation_responses.map((row, index) => (
        <StakingCard
          key={index}
          validator={
            validators?.active[row.delegation.validator_address]?.description
              .moniker
          }
          identity={validators?.active[row.delegation.validator_address]?.description
            .identity}
          chainName={chainName}
          commission={
            Number(
              validators?.active[
                delegations?.delegation_responses[0]?.delegation
                  ?.validator_address
              ]?.commission?.commission_rates.rate
            ) * 100
          }
          delegated={
            parseFloat(row?.delegation?.shares) / 10 ** currency?.coinDecimals
          }
          networkLogo={networkLogo}
          coinDenom={currency.coinDenom}
        />
      ))}
    </>
  );
};

export default ChainDelegations;
