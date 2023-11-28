'use client';

import React, { useEffect } from 'react';
import StakingOverview from './components/StakingOverview';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { getDelegations } from '@/store/features/staking/stakeSlice';
import StakingOverviewSidebar from './components/StakingOverviewSidebar';

const Staking = () => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const allChainInfo = networks[chainID];
      const chainInfo = allChainInfo.network;
      const address = allChainInfo?.walletInfo?.bech32Address;
      const baseURL = chainInfo.config.rest;
      const basicChainInputs = {
        baseURL,
        address,
        chainID,
      };

      dispatch(getDelegations(basicChainInputs));
    });
  }, []);

  return (
    <div className="flex justify-between">
      <StakingOverview />
      <StakingOverviewSidebar />
    </div>
  );
};

export default Staking;
