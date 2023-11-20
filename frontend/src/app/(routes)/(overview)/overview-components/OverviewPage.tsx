'use client';
import React, { useEffect } from 'react';
import { RootState } from '../../../../store/store';
import { getBalances } from '@/store/features/bank/bankSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  getDelegations,
  getAllValidators,
} from '@/store/features/staking/stakeSlice';
import useGetAssetsAmount from '@/custom-hooks/useGetAssetsAmount';
import useGetSortedChainIDs from '@/custom-hooks/useGetSortedChainIDs';
import useGetIBCSortedChainIDs from '@/custom-hooks/useGetIBCSortedChainIds';

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
  const [nativeSortedChainIds] = useGetSortedChainIDs();
  const [ibcSortedChainIds] = useGetIBCSortedChainIDs();

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
    <div>
      {JSON.stringify(nativeSortedChainIds)}
      <br />
      <br />
      {JSON.stringify(ibcSortedChainIds)}
      <br />
      <br />
      {totalAvailableAmount +
        ' ' +
        totalRewardsAmount +
        ' ' +
        totalStakedAmount}
    </div>
  );
};

export default OverviewPage;
