'use client';

import React, { useEffect } from 'react';
import { RootState } from '../../../../store/store';
import { getBalances } from '@/store/features/bank/bankSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  getDelegations,
  getAllValidators,
} from '@/store/features/staking/stakeSlice';
import WalletSummery from './WalletSummery';
import TopNav from './TopNav';
import History from './History';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import PageAd from './PageAd';
import AssetsTable from './AssetsTable';

const OverviewPage = () => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  const [totalStakedAmount, totalAvailableAmount, totalRewardsAmount] =
    useGetAssetsAmount();

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

      dispatch(getBalances(basicChainInputs));
      dispatch(getDelegations(basicChainInputs));
      dispatch(
        getAllValidators({
          baseURL: chainInfo.config.rest,
          chainID: chainID,
        })
      );

      // Todo: after distribution slice
      //   dispatch(
      //     getDelegatorTotalRewards({
      //       baseURL: chainInfo.config.rest,
      //       address: address,
      //       chainID: chainID,
      //       denom: denom,
      //     })
      //   );
    });
  }, []);

  return (
    <div className="w-full flex justify-between">
      <div className="w-full px-10 py-6 space-y-6 overflow-y-scroll min-h-[800px] h-screen">
        <TopNav />
        <WalletSummery
          available={totalAvailableAmount}
          staked={totalStakedAmount}
          rewards={totalRewardsAmount}
        />
        <PageAd />
        <AssetsTable />
      </div>
      <History />
    </div>
  );
};

export default OverviewPage;
