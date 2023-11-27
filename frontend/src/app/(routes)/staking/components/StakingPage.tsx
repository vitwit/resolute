'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getAllValidators,
  getDelegations,
  getParams,
  getUnbonding,
} from '@/store/features/staking/stakeSlice';

import ChainDelegations from './ChainDelegations';
import StakingSidebar from './StakingSidebar';
import ChainUnbondings from './ChainUnbondings';
import { getDelegatorTotalRewards } from '@/store/features/distribution/distributionSlice';
import { Validator } from '@/types/staking';
import { useRouter } from 'next/navigation';
import { getBalances } from '@/store/features/bank/bankSlice';

const StakingPage = ({
  chainName,
  validatorAddress,
  action,
}: {
  chainName: string;
  validatorAddress: string;
  action: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainID = nameToChainIDs[chainName];
  const delegations = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.delegations.delegations
  );
  const unbondingDelegations = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.unbonding.unbonding
  );
  const validators = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.validators
  );
  const currency = useAppSelector(
    (state: RootState) =>
      state.wallet.networks[chainID].network?.config?.currencies[0]
  );
  const rewards = useAppSelector(
    (state: RootState) =>
      state.distribution.chains?.[chainID]?.delegatorRewards.list
  );

  const allChainInfo = networks[chainID];
  const chainInfo = allChainInfo?.network;
  const address = allChainInfo?.walletInfo?.bech32Address;
  const baseURL = chainInfo?.config?.rest;

  useEffect(() => {
    dispatch(
      getDelegations({
        baseURL,
        address,
        chainID,
      })
    );
    dispatch(
      getAllValidators({
        baseURL,
        chainID,
      })
    );
    dispatch(
      getUnbonding({
        baseURL,
        address,
        chainID,
      })
    );
    dispatch(
      getDelegatorTotalRewards({
        baseURL,
        address,
        chainID,
        denom: currency.coinMinimalDenom,
      })
    );
    dispatch(
      getBalances({
        baseURL,
        address,
        chainID,
      })
    );
    dispatch(getParams({ baseURL, chainID }));
  }, [chainID]);

  const onMenuAction = (type: string, validator: Validator) => {
    const valAddress = validator.operator_address;
    router.push(`?validator_address=${valAddress}&action=${type}`);
  };

  return (
    <div className="flex justify-between">
      <div className="staking-main">
        <h2 className="txt-lg font-medium mb-6">Staking</h2>
        <div className="overview-grid">
          <ChainDelegations
            chainID={chainID}
            chainName={chainName}
            delegations={delegations}
            validators={validators}
            currency={currency}
            rewards={rewards}
            validatorAddress={validatorAddress}
            action={action}
            chainSpecific={true}
          />
        </div>

        <div>
          <h2 className="txt-lg font-medium my-6">Unbonding</h2>
          <div className="overview-grid">
            <ChainUnbondings
              chainID={chainID}
              chainName={chainName}
              unbondings={unbondingDelegations}
              validators={validators}
              currency={currency}
            />
          </div>
        </div>
      </div>
      <StakingSidebar
        chainID={chainID}
        validators={validators}
        currency={currency}
        onMenuAction={onMenuAction}
      />
    </div>
  );
};

export default StakingPage;
