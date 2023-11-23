'use client';

import React, { useEffect } from 'react';
import StakingOverview from './components/StakingOverview';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
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

  const [totalStakedAmount] =
    useGetAssetsAmount(chainIDs);

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const allChainInfo = networks[chainID];
      const chainInfo = allChainInfo.network;
      const address = allChainInfo?.walletInfo?.bech32Address;
      const basicChainInputs = {
        baseURL: chainInfo.config.rest,
        address,
        chainID,
      };

      dispatch(getDelegations(basicChainInputs));
    });
  }, []);

  return (
    <div className="flex justify-between">
      <StakingOverview />
      <StakingOverviewSidebar totalStakedAmount={totalStakedAmount} />
    </div>
  );
};

export default Staking;
