import React, { useEffect } from 'react';
import AssetsTable from './AssetsTable';
import TokenAllocation from './TokenAllocation';
import BalanceSummary from './BalanceSummary';
import GovernanceView from './GovernanceView';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getBalances } from '@/store/features/bank/bankSlice';
import {
  getDelegations,
  getUnbonding,
} from '@/store/features/staking/stakeSlice';
import { getAccountInfo } from '@/store/features/auth/authSlice';
import { getDelegatorTotalRewards } from '@/store/features/distribution/distributionSlice';
import { RootState } from '@/store/store';

const OverviewDashboard = ({ chainIDs }: { chainIDs: string[] }) => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state) => state.wallet.networks);
  useEffect(() => {
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
      // dispatch(getBalances(basicChainInputs));
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

  const allNameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );

  useEffect(() => {
    const allChainIDs = Object.keys(allNameToChainIDs).map(
      (chainName) => allNameToChainIDs[chainName]
    );

    allChainIDs.forEach((chainID) => {
      const allChainInfo = networks[chainID];
      const chainInfo = allChainInfo.network;
      const address = allChainInfo?.walletInfo?.bech32Address;
      const basicChainInputs = {
        baseURL: chainInfo.config.rest,
        baseURLs: chainInfo.config.restURIs,
        address,
        chainID,
      };

      dispatch(getBalances(basicChainInputs));
    });
  }, [])

  return (
    <div>
      <div className="flex pt-10 gap-10">
        <div className="flex flex-1">
          <div className="flex flex-col gap-10 h-[calc(100vh-104px)] overflow-y-auto pb-3">
            <BalanceSummary chainIDs={chainIDs} />
            <AssetsTable chainIDs={chainIDs} />
          </div>
        </div>
        <div className="flex flex-col gap-10 h-[calc(100vh-104px)] pb-3">
          <TokenAllocation />
          <GovernanceView chainIDs={chainIDs} />
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
