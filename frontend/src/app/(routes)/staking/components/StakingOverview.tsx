'use client';

import React, { useEffect } from 'react';
import './../staking.css';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getAllValidators,
  getDelegations,
} from '@/store/features/staking/stakeSlice';
import ChainDelegations from './ChainDelegations';

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
  useEffect(() => {
    if (chainIDs) {
      chainIDs.forEach((chainID) => {
        const allChainInfo = networks[chainID];
        const chainInfo = allChainInfo?.network;
        const address = allChainInfo?.walletInfo?.bech32Address;
        const baseURL = chainInfo?.config?.rest;

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
      });
    }
  }, []);
  return (
    <div className="px-10 py-6 flex-1 h-screen min-h-[800px] overflow-y-scroll no-scrollbar">
      <h2 className="txt-lg font-medium mb-6">Staking</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {chainIDs.map((chainID, index) => {
          const delegations = stakingData[chainID]?.delegations.delegations;
          const validators = stakingData[chainID]?.validators;
          const currency = networks[chainID]?.network?.config?.currencies[0];
          const chainName = networks[chainID]?.network?.config?.chainName;
          return (
            <ChainDelegations
              key={index}
              chainID={chainID}
              chainName={chainName}
              delegations={delegations}
              validators={validators}
              currency={currency}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StakingOverview;
