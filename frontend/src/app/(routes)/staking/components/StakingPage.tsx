'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getAllValidators,
  getDelegations,
  getValidators,
} from '@/store/features/staking/stakeSlice';

import ChainDelegations from './ChainDelegations';
import StakingSidebar from './StakingSidebar';

const StakingPage = ({ chainName }: { chainName: string }) => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainID = nameToChainIDs[chainName];
  const delegations = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.delegations.delegations
  );
  const validators = useAppSelector(
    (state: RootState) => state.staking.chains[chainID]?.validators
  );
  const currency = useAppSelector(
    (state: RootState) =>
      state.wallet.networks[chainID].network?.config?.currencies[0]
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
  }, []);

  return (
    <div className="flex justify-between">
      <div className="p-10 flex-1 h-screen min-h-[800px] overflow-y-scroll no-scrollbar">
        <ChainDelegations
          chainID={chainID}
          chainName={chainName}
          delegations={delegations}
          validators={validators}
          currency={currency}
        />
      </div>
      <StakingSidebar validators={validators} />
    </div>
  );
};

export default StakingPage;
