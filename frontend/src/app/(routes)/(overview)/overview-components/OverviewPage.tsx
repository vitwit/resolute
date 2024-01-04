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
import PageAd from './PageAd';
import AssetsTable from './AssetsTable';
import AccountSummery from './AccountSummary';
import { getAccountInfo } from '@/store/features/auth/authSlice';
import { getDelegatorTotalRewards } from '@/store/features/distribution/distributionSlice';

const OverviewPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const allChainInfo = networks[chainID];
      const chainInfo = allChainInfo.network;
      const address = allChainInfo?.walletInfo?.bech32Address;
      const minimalDenom =
        allChainInfo.network.config.stakeCurrency.coinMinimalDenom;
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
      dispatch(getAccountInfo(basicChainInputs));
      dispatch(
        getDelegatorTotalRewards({
          baseURL: chainInfo.config.rest,
          address: address,
          chainID: chainID,
          denom: minimalDenom,
        })
      );
    });
  }, []);

  return (
    <div className="w-full flex justify-between">
      <div className="flex flex-col w-full px-10 py-6 space-y-6 min-h-screen max-h-screen">
        <TopNav />
        <WalletSummery chainIDs={chainIDs} />
        {chainIDs.length === 1 && <AccountSummery chainID={chainIDs[0]} />}
        <PageAd />
        <div className="flex items-center min-h-[36px] h-8">
          <h2 className="text-xl not-italic font-normal leading-[normal]">
            Asset Information
          </h2>
        </div>
        <AssetsTable chainIDs={chainIDs} />
      </div>
      <History chainIDs={chainIDs} />
    </div>
  );
};

export default OverviewPage;
