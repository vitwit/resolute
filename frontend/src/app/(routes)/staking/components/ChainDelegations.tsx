'use client';
import { GetDelegationsResponse, Validators } from '@/types/staking';
import React, { useEffect } from 'react';
import StakingCard from './StakingCard';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { DelegatorRewards } from '@/types/distribution';

const ChainDelegations = ({
  chainID,
  delegations,
  validators,
  currency,
  chainName,
  rewards,
}: {
  chainID: string;
  chainName: string;
  delegations: GetDelegationsResponse;
  validators: Validators;
  currency: Currency;
  rewards: DelegatorRewards[];
}) => {
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const networkLogo = networks[chainID].network.logos.menu;

  const [validatorRewards, setValidatorRewards] = React.useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    if (rewards?.length > 0) {
      for (let i = 0; i < rewards.length; i++) {
        if (rewards[i].reward.length > 0) {
          const reward = rewards[i].reward;
          for (let j = 0; j < reward.length; j++) {
            if (reward[j].denom === currency.coinMinimalDenom) {
              const valReward = validatorRewards;
              valReward[rewards[i].validator_address] =
                parseFloat(reward[j].amount) / 10 ** currency?.coinDecimals;
              setValidatorRewards(valReward);
            }
          }
        } else {
          const valReward = validatorRewards;
          valReward[rewards[i].validator_address] = 0.0;
          setValidatorRewards(valReward);
        }
      }
    }
  }, [rewards]);


  return (
    <>
      {delegations?.delegation_responses.map((row, index) => (
        <StakingCard
          key={index}
          validator={
            validators?.active[row.delegation.validator_address]?.description
              .moniker
          }
          identity={
            validators?.active[row.delegation.validator_address]?.description
              .identity
          }
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
          rewards={validatorRewards?.[row.delegation.validator_address] || 0}
          networkLogo={networkLogo}
          coinDenom={currency.coinDenom}
        />
      ))}
    </>
  );
};

export default ChainDelegations;
