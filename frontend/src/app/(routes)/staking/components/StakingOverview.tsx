'use client';

import React, { useEffect } from 'react';
import './../staking.css';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getAllValidators,
  getDelegations,
  getParams,
  getUnbonding,
} from '@/store/features/staking/stakeSlice';
import ChainDelegations from './ChainDelegations';
import ChainUnbondings from './ChainUnbondings';
import { getDelegatorTotalRewards } from '@/store/features/distribution/distributionSlice';
import { getBalances } from '@/store/features/bank/bankSlice';

const StakingOverview = () => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  const stakingData = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const rewardsData = useAppSelector(
    (state: RootState) => state.distribution.chains
  );
  const hasDelegations = useAppSelector(
    (state: RootState) => state.staking.hasDelegations
  );
  const hasUnbonding = useAppSelector(
    (state: RootState) => state.staking.hasUnbonding
  );
  useEffect(() => {
    if (chainIDs) {
      chainIDs.forEach((chainID) => {
        const allChainInfo = networks[chainID];
        const chainInfo = allChainInfo?.network;
        const address = allChainInfo?.walletInfo?.bech32Address;
        const baseURL = chainInfo?.config?.rest;
        const currency = allChainInfo?.network?.config?.currencies[0];

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
      });
    }
  }, []);
  return (
    <div className="staking-main">
      <h2 className="txt-lg font-medium mb-6">Staking</h2>
      {hasDelegations ? (
        <div className="overview-grid">
          {chainIDs.map((chainID, index) => {
            const delegations = stakingData[chainID]?.delegations.delegations;
            const validators = stakingData[chainID]?.validators;
            const currency = networks[chainID]?.network?.config?.currencies[0];
            const chainName = networks[chainID]?.network?.config?.chainName;
            const rewards = rewardsData[chainID]?.delegatorRewards?.list;
            return (
              <ChainDelegations
                key={index}
                chainID={chainID}
                chainName={chainName}
                delegations={delegations}
                rewards={rewards}
                validators={validators}
                currency={currency}
                validatorAddress=""
                action=""
                chainSpecific={false}
              />
            );
          })}
        </div>
      ) : (
        <div className="mt-36 txt-md font-medium text-center">
          - No Delegations -
        </div>
      )}
      {hasUnbonding ? (
        <>
          <h2 className="txt-lg font-medium my-6">Unbonding</h2>
          <div className="unbonding-grid">
            {chainIDs.map((chainID, index) => {
              const unbondingDelegations =
                stakingData[chainID]?.unbonding.unbonding;
              const validators = stakingData[chainID]?.validators;
              const currency =
                networks[chainID]?.network?.config?.currencies[0];
              const chainName = networks[chainID]?.network?.config?.chainName;
              return (
                <ChainUnbondings
                  key={index}
                  chainID={chainID}
                  chainName={chainName}
                  unbondings={unbondingDelegations}
                  validators={validators}
                  currency={currency}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default StakingOverview;
