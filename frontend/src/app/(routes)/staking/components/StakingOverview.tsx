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
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import { NO_MESSAGES_ILLUSTRATION } from '@/utils/constants';
import { CircularProgress } from '@mui/material';

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
  const delegationsLoading = useAppSelector(
    (state: RootState) => state.staking.delegationsLoading
  );
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  useEffect(() => {
    if (chainIDs) {
      chainIDs.forEach((chainID) => {
        const { address, baseURL } = getChainInfo(chainID);
        const { minimalDenom } = getDenomInfo(chainID);

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
            denom: minimalDenom,
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
      <div className="overview-grid">
        {chainIDs.map((chainID) => {
          const delegations = stakingData[chainID]?.delegations.delegations;
          const validators = stakingData[chainID]?.validators;
          const currency = networks[chainID]?.network?.config?.currencies[0];
          const chainName = networks[chainID]?.network?.config?.chainName;
          const rewards = rewardsData[chainID]?.delegatorRewards?.list;

          return (
            <ChainDelegations
              key={chainID}
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

      {delegationsLoading === 0 && !hasDelegations ? (
        <div className="no-data">
          <Image
            src={NO_MESSAGES_ILLUSTRATION}
            width={200}
            height={177}
            alt={'No Transactions'}
          />
          <div className="text-[16px] opacity-50 mt-2 mb-6 leading-normal italic font-extralight text-center">
            Looks like you haven't staked anything yet, go ahead and explore !
          </div>
        </div>
      ) : null}

      {hasUnbonding ? (
        <div className="mt-12">
          <h2 className="txt-lg font-medium my-6">Unbonding</h2>
          <div className="unbondings-grid">
            {chainIDs.map((chainID) => {
              const unbondingDelegations =
                stakingData[chainID]?.unbonding.unbonding;
              const validators = stakingData[chainID]?.validators;
              const { chainName, currencies } =
                networks[chainID]?.network?.config;

              return (
                <ChainUnbondings
                  key={chainID}
                  chainID={chainID}
                  chainName={chainName}
                  unbondings={unbondingDelegations}
                  validators={validators}
                  currency={currencies[0]}
                />
              );
            })}
          </div>
        </div>
      ) : null}
      {delegationsLoading !== 0 ? (
        <div className="no-data">
          <CircularProgress size={32} sx={{ color: 'white' }} />
        </div>
      ) : null}
    </div>
  );
};

export default StakingOverview;
