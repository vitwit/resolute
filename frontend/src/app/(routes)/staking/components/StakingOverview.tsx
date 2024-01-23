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
import {
  NO_DELEGATIONS_MSG,
  NO_MESSAGES_ILLUSTRATION,
} from '@/utils/constants';
import { CircularProgress } from '@mui/material';
import MainTopNav from '@/components/MainTopNav';
import useInitAuthzStaking from '@/custom-hooks/useInitAuthzStaking';
import AuthzToast from '@/components/AuthzToast';
import AuthzExecLoader from '@/components/AuthzExecLoader';

const StakingOverview = () => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);

  const stakingData = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const authzStakingData = useAppSelector(
    (state: RootState) => state.staking.authz.chains
  );
  const rewardsData = useAppSelector(
    (state: RootState) => state.distribution.chains
  );
  const authzRewardsData = useAppSelector(
    (state: RootState) => state.distribution.authzChains
  );
  const hasDelegations = useAppSelector(
    (state: RootState) => state.staking.hasDelegations
  );
  const hasAuthzDelegations = useAppSelector(
    (state: RootState) => state.staking.authz.hasDelegations
  );
  const hasUnbonding = useAppSelector(
    (state: RootState) => state.staking.hasUnbonding
  );
  const hasAuthzUnbonding = useAppSelector(
    (state: RootState) => state.staking.authz.hasUnbonding
  );
  const delegationsLoading = useAppSelector(
    (state: RootState) => state.staking.delegationsLoading
  );
  const authzDelegationsLoading = useAppSelector(
    (state: RootState) => state.staking.authz.delegationsLoading
  );
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  useInitAuthzStaking(chainIDs);

  useEffect(() => {
    if (chainIDs) {
      chainIDs.forEach((chainID) => {
        const { address, baseURL, restURLs } = getChainInfo(chainID);
        const { minimalDenom } = getDenomInfo(chainID);

        dispatch(
          getDelegations({
            baseURLs: restURLs,
            address,
            chainID,
          })
        );
        dispatch(
          getAllValidators({
            baseURLs: restURLs,
            chainID,
          })
        );
        dispatch(
          getUnbonding({
            baseURLs: restURLs,
            address,
            chainID,
          })
        );
        dispatch(
          getDelegatorTotalRewards({
            baseURLs: restURLs,
            baseURL,
            address,
            chainID,
            denom: minimalDenom,
          })
        );
        dispatch(
          getBalances({
            baseURLs: restURLs,
            baseURL,
            address,
            chainID,
          })
        );
        dispatch(getParams({ baseURLs: restURLs, chainID }));
      });
    }
  }, []);

  return (
    <div className="staking-main">
      <div className="mb-6">
        <AuthzExecLoader chainIDs={chainIDs} />
        <MainTopNav title="Staking" />
        <AuthzToast chainIDs={chainIDs} margins="mt-10 mb-10" />
      </div>
      <div className="overview-grid">
        {chainIDs.map((chainID) => {
          const delegations = (
            isAuthzMode ? authzStakingData[chainID] : stakingData[chainID]
          )?.delegations.delegations;
          const validators = stakingData[chainID]?.validators;
          const currency = networks[chainID]?.network?.config?.currencies[0];
          const chainName = networks[chainID]?.network?.config?.chainName;
          const rewards = (
            isAuthzMode ? authzRewardsData[chainID] : rewardsData[chainID]
          )?.delegatorRewards?.list;

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

      {(!isAuthzMode && delegationsLoading === 0 && !hasDelegations) ||
      (isAuthzMode && authzDelegationsLoading && !hasAuthzDelegations) ? (
        <div className="no-data">
          <Image
            src={NO_MESSAGES_ILLUSTRATION}
            width={200}
            height={177}
            alt={'No Transactions'}
            draggable={false}
          />
          <div className="text-[16px] opacity-50 mt-2 mb-6 leading-normal italic font-extralight text-center">
            {NO_DELEGATIONS_MSG}
          </div>
        </div>
      ) : null}

      {delegationsLoading !== 0 ? (
        <div className="no-data">
          <CircularProgress size={32} sx={{ color: 'white' }} />
        </div>
      ) : null}

      {(!isAuthzMode && hasUnbonding) || (isAuthzMode && hasAuthzUnbonding) ? (
        <div className="mt-12">
          <h2 className="txt-lg font-medium my-6">Unbonding</h2>
          <div className="unbondings-grid">
            {chainIDs.map((chainID) => {
              const unbondingDelegations = (
                isAuthzMode ? authzStakingData[chainID] : stakingData[chainID]
              )?.unbonding.unbonding;
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
    </div>
  );
};

export default StakingOverview;
