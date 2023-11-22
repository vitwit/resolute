'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getAllValidators,
  getDelegations,
  getUnbonding,
} from '@/store/features/staking/stakeSlice';

import ChainDelegations from './ChainDelegations';
import StakingSidebar from './StakingSidebar';
import ChainUnbondings from './ChainUnbondings';

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
  }, []);

  return (
    <div className="flex justify-between">
      <div className="px-10 py-6 flex-1 h-screen min-h-[800px] overflow-y-scroll">
        <h2 className="txt-lg font-medium mb-6">Staking</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <ChainDelegations
            chainID={chainID}
            chainName={chainName}
            delegations={delegations}
            validators={validators}
            currency={currency}
          />
        </div>

        <div>
          <h2 className="txt-lg font-medium my-6">Unbonding</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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
      <StakingSidebar validators={validators} currency={currency} />
    </div>
  );
};

export default StakingPage;
