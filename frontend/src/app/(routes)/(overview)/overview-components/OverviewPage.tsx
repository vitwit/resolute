'use client';
import React, { useCallback, useEffect, useMemo } from 'react';
import { RootState } from '../../../..//store/store';
import { parseBalance } from '@/utils/denom';
import { getBalances } from '@/store/features/bank/bankSlice';
import { getIBCBalances } from '@/utils/ibc';
import chainDenoms from '@/utils/chainDenoms.json';
import { useAppDispatch, useAppSelector } from '@/hooks/StateHooks';
import {
  getDelegations,
  getAllValidators,
} from '@/store/features/staking/stakeSlice';

const chainDenomsData = chainDenoms as AssetData;

const OverviewPage = () => {
  const dispatch = useAppDispatch();
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const stakingChains = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const balanceChains = useAppSelector(
    (state: RootState) => state.bank.balances
  );
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  const chainIdToNames = useMemo(() => {
    const chainIdToNames: Record<string, string> = {};
    for (const key in nameToChainIDs) {
      chainIdToNames[nameToChainIDs[key]] = key;
    }
    return chainIdToNames;
  }, [nameToChainIDs]);

  const convertToDollars = (denom: string, amount: number) => {
    // todo: after common slice
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const tokensPriceInfo: any = {};
    if (tokensPriceInfo?.[denom]) {
      const price = +tokensPriceInfo?.[denom]?.info?.['usd'] || 0;
      return amount * price;
    }
    return 0;
  };

  const calculateTotalStakedAmount = useCallback(() => {
    let totalStakedAmount = 0;
    chainIDs.forEach((chainID) => {
      const staked = stakingChains?.[chainID]?.delegations?.totalStaked || 0;
      if (staked > 0) {
        const denom =
          networks?.[chainID]?.network?.config?.currencies?.[0]
            ?.coinMinimalDenom;
        const decimals =
          networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
          0;
        totalStakedAmount += convertToDollars(denom, staked / 10 ** decimals);
      }
    });
    return totalStakedAmount;
  }, [chainIDs, stakingChains, networks]);

  // Todo: can be added after distribution slice is added
  //   const calculateTotalPendingAmount = useCallback(() => {
  //     let totalRewards = 0;
  //     chainIDs.forEach((chainID) => {
  //       const rewards =
  //         distributionChains?.[chainID]?.delegatorRewards?.totalRewards || 0;
  //       if (rewards > 0) {
  //         const denom =
  //           networks?.[chainID]?.network?.config?.currencies?.[0]
  //             ?.coinMinimalDenom;
  //         const decimals =
  //           networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
  //           0;
  //         totalRewards += convertToDollars(denom, rewards / 10 ** decimals);
  //       }
  //     });
  //     return totalRewards;
  //   }, [chainIDs, distributionChains, networks]);

  const calculateTotalAvailableAmount = useCallback(() => {
    let totalBalance = 0;
    let totalIBCBalance = 0;
    chainIDs.forEach((chainID) => {
      const decimals =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
        0;
      const denom =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
      const balance = parseBalance(
        balanceChains?.[chainID]?.list || [],
        decimals,
        denom
      );
      const chainName =
        networks?.[chainID]?.network?.config?.chainName.toLowerCase();
      const ibcBalances = getIBCBalances(
        balanceChains?.[chainID]?.list,
        denom,
        chainName
      );
      for (let i = 0; i < ibcBalances?.length; i++) {
        totalIBCBalance += convertToDollars(
          ibcBalances[i].balance.denom,
          parseBalance(
            [ibcBalances[i].balance],
            ibcBalances?.[i]?.decimals,
            ibcBalances?.[i]?.balance.denom
          )
        );
      }
      if (balanceChains?.[chainID]?.list?.length > 0) {
        totalBalance += convertToDollars(denom, balance);
      }
    });
    return { totalBalance: totalBalance, totalIBCBalance: totalIBCBalance };
  }, [chainIDs, balanceChains, networks]);

  const getSortedChainIds = useCallback(() => {
    let sortedChains: { chainID: string; usdValue: number }[] = [];
    chainIDs.forEach((chainID) => {
      const decimals =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinDecimals ||
        0;
      const denom =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
      const balanceAmountInDenoms = parseBalance(
        balanceChains?.[chainID]?.list || [],
        decimals,
        denom
      );
      // minimalDenom
      const stakedAmountInDenoms: number =
        stakingChains?.[chainID]?.delegations?.totalStaked || 0;
      // minimalDenom
      // Todo: after distribution slice is added
      //   const rewards =
      //     distributionChains?.[chainID]?.delegatorRewards?.totalRewards || 0;
      const rewardsAmountInDenoms: number = 0;
      const chain: { chainID: string; usdValue: number } = {
        chainID,
        usdValue: 0,
      };
      if (balanceChains?.[chainID]?.list?.length > 0) {
        chain.usdValue =
          convertToDollars(denom, balanceAmountInDenoms) +
          convertToDollars(denom, stakedAmountInDenoms / 10 ** decimals) +
          convertToDollars(denom, rewardsAmountInDenoms / 10 ** decimals);
      }
      sortedChains = [...sortedChains, chain];
    });
    sortedChains.sort((x, y) => y.usdValue - x.usdValue);
    return sortedChains.map((chain) => chain.chainID);
  }, [chainIDs, networks, balanceChains]);

  const getIBCSortedChainIds = useCallback(() => {
    let sortedIBCChains: {
      usdValue: number;
      usdPrice: number;
      balanceAmount: number;
      chainName: string;
      denomInfo: (IBCAsset | NativeAsset)[];
    }[] = [];

    chainIDs.forEach((chainID) => {
      const chainName = chainIdToNames[chainID];
      const minimalDenom =
        networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;
      const chainBalances = balanceChains?.[chainID]?.list || [];
      chainBalances.forEach((balance) => {
        const denomInfo = chainDenomsData[chainName]?.filter((denomInfo) => {
          return denomInfo.denom === balance.denom;
        });
        if (balance?.denom !== minimalDenom && denomInfo?.length) {
          //   const usdDenomPrice =
          //     tokensPriceInfo[denomInfo[0]?.origin_denom]?.info?.['usd'] || 0;
          const usdDenomPrice = 0;
          const balanceAmount = parseBalance(
            [balance],
            denomInfo[0].decimals,
            balance.denom
          );
          const usdDenomValue = balanceAmount * usdDenomPrice;
          sortedIBCChains = [
            ...sortedIBCChains,
            {
              usdValue: usdDenomValue,
              usdPrice: usdDenomPrice,
              balanceAmount: balanceAmount,
              chainName: chainName,
              denomInfo: denomInfo,
            },
          ];
        }
      });
    });

    sortedIBCChains.sort((x, y) => y.usdValue - x.usdValue);
    return sortedIBCChains;
  }, [chainIDs, networks, balanceChains]);

  useEffect(() => {
    chainIDs.forEach((chainID) => {
      const chainInfo = networks[chainID]?.network;
      const address = networks[chainID]?.walletInfo?.bech32Address;
      //   const denom =
      //     networks?.[chainID]?.network?.config?.currencies?.[0]?.coinMinimalDenom;

      dispatch(
        getBalances({
          baseURL: chainInfo.config.rest,
          address: address,
          chainID: chainID,
        })
      );

      dispatch(
        getDelegations({
          baseURL: chainInfo.config.rest,
          address: address,
          chainID: chainID,
        })
      );

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

  const {
    totalBalance: totalAvailableAmount,
    totalIBCBalance: totalIBCAssetsAmount,
  } = useMemo(
    () => calculateTotalAvailableAmount(),
    [calculateTotalAvailableAmount]
  );
  const totalStakedAmount = useMemo(
    () => calculateTotalStakedAmount(),
    [calculateTotalStakedAmount]
  );
  //   const totalPendingAmount = useMemo(
  //     () => calculateTotalPendingAmount(),
  //     [calculateTotalPendingAmount]
  //   );

  const sortedChainIds = useMemo(
    () => getSortedChainIds(),
    [getSortedChainIds]
  );

  const ibcSortedChains = useMemo(
    () => getIBCSortedChainIds(),
    [getIBCSortedChainIds]
  );
  return (
    <div>
      {JSON.stringify(sortedChainIds)}
      <br />
      <br />
      {JSON.stringify(ibcSortedChains)}
      <br />
      <br />
      {totalAvailableAmount +
        ' ' +
        totalIBCAssetsAmount +
        ' ' +
        totalStakedAmount}
    </div>
  );
};

export default OverviewPage;
