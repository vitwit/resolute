'use client';

import React, { useEffect } from 'react';
import { RootState } from '../../../../store/store';
import { getBalances } from '@/store/features/bank/bankSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  getDelegations,
  getUnbonding,
} from '@/store/features/staking/stakeSlice';
// import WalletSummery from './WalletSummery';
// import TopNav from './TopNav';
// import History from './History';
// import PageAd from './PageAd';
// import AssetsTable from './AssetsTable';
// import AccountSummery from './AccountSummary';
import { getAccountInfo } from '@/store/features/auth/authSlice';
import { getDelegatorTotalRewards } from '@/store/features/distribution/distributionSlice';
import useInitAuthzForOverview from '@/custom-hooks/useInitAuthzForOverview';
// import AuthzToast from '@/components/AuthzToast';
// import AuthzExecLoader from '@/components/AuthzExecLoader';
// import FeegrantToast from '@/components/FeegrantToast';
// import { getRecentTransactions } from '@/store/features/recent-transactions/recentTransactionsSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import BalanceSummary from './BalanceSummary';
import {
  getAllTokensPrice,
  setError,
} from '@/store/features/common/commonSlice';
import { copyToClipboard } from '@/utils/copyToClipboard';
import AssetsTable from './AssetsTable';
import { shortenAddress } from '@/utils/util';

const OverviewTable = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();

  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  // const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  // const isFeegrantMode = useAppSelector(
  //   (state) => state.feegrant.feegrantModeEnabled
  // );
  const { getAllChainAddresses, getCosmosAddress } = useGetChainInfo();

  const addresses = getAllChainAddresses(chainIDs);

  useInitAuthzForOverview(chainIDs);
  useEffect(() => {
    dispatch(getAllTokensPrice());

    chainIDs.forEach((chainID) => {
      const allChainInfo = networks[chainID];
      const chainInfo = allChainInfo.network;
      const address = allChainInfo?.walletInfo?.bech32Address;

      const minimalDenom =
        allChainInfo.network.config.stakeCurrency.coinMinimalDenom;
      const basicChainInputs = {
        baseURL: chainInfo.config.rest,
        baseURLs: chainInfo.config.restURIs,
        address,
        chainID,
      };
      dispatch(getBalances(basicChainInputs));
      dispatch(getDelegations(basicChainInputs));
      dispatch(getAccountInfo(basicChainInputs));
      dispatch(
        getDelegatorTotalRewards({
          baseURLs: chainInfo.config.restURIs,
          baseURL: chainInfo.config.rest,
          address: address,
          chainID: chainID,
          denom: minimalDenom,
        })
      );
      dispatch(
        getUnbonding({
          baseURLs: chainInfo.config.restURIs,
          address: address,
          chainID,
        })
      );
    });
  }, []);

  return (
    <div className="flex-col px-10 pt-20">
      <div className="flex flex-col items-center gap-10 mb-20">
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex space-x-2">
            <div className="text-h1 italic space-x-4">Hello</div>
            <div className="flex items-center space-x-2">
              <p className="text-white text-2xl font-normal leading-[normal]">
                {shortenAddress(getCosmosAddress(), 20)}
              </p>
              <Image
                onClick={(e) => {
                  copyToClipboard(addresses?.[0]?.address);
                  dispatch(
                    setError({
                      type: 'success',
                      message: 'Copied',
                    })
                  );
                  e.preventDefault();
                  e.stopPropagation();
                }}
                src="/copy.svg"
                width={24}
                height={24}
                alt="copy"
                draggable={false}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="secondary-text">
            Summary of your assets across all chains
          </div>
          <div className="divider-line"></div>
        </div>

        <BalanceSummary chainIDs={chainIDs} />
      </div>

      <AssetsTable chainIDs={chainIDs} />
    </div>
  );
};

export default OverviewTable;