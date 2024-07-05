import { RootState } from '@/store/store';
import { useMemo } from 'react';
import { useAppSelector } from './StateHooks';
import { parseBalance } from '@/utils/denom';
import { getIBCBalances } from '@/utils/ibc';
import useGetChainInfo from './useGetChainInfo';

const useGetAssetsAmount = (chainIDs: string[]) => {
  const stakingChains = useAppSelector(
    (state: RootState) => state.staking.chains
  );

  const balanceChains = useAppSelector(
    (state: RootState) => state.bank.balances
  );
  const rewardsChains = useAppSelector(
    (state: RootState) => state.distribution.chains
  );
  const tokensPriceInfo = useAppSelector(
    (state) => state.common.allTokensInfoState.info
  );



  const { getDenomInfo } = useGetChainInfo();

  // calculates staked amount in usd
  const totalStakedAmount = useMemo(() => {
    let totalStakedAmount = 0;
    chainIDs.forEach((chainID) => {
      const staked = stakingChains?.[chainID]?.delegations?.totalStaked || 0;

      if (staked > 0) {
        const { decimals, minimalDenom } = getDenomInfo(chainID);
        const usdPriceInfo: TokenInfo | undefined =
          tokensPriceInfo?.[minimalDenom]?.info;
        const usdDenomPrice = usdPriceInfo?.usd || 0;
        totalStakedAmount += (staked / 10 ** decimals) * usdDenomPrice;
      }
    });

    return totalStakedAmount;
  }, [chainIDs, stakingChains, getDenomInfo, tokensPriceInfo]);


  // calculates un staked amount in usd
  const totalUnStakedAmount = useMemo(() => {
    let totalUnStakedAmount = 0;
    chainIDs.forEach((chainID) => {
      const unStaked = stakingChains?.[chainID]?.unbonding?.totalUnbonded || 0;
      if (unStaked > 0) {
        const { decimals, minimalDenom } = getDenomInfo(chainID);
        const usdPriceInfo: TokenInfo | undefined =
          tokensPriceInfo?.[minimalDenom]?.info;
        const usdDenomPrice = usdPriceInfo?.usd || 0;
        totalUnStakedAmount += (unStaked / 10 ** decimals) * usdDenomPrice;
      }
    });

    return totalUnStakedAmount;
  }, [chainIDs, stakingChains, getDenomInfo, tokensPriceInfo]);

  // calculates bank balances (native + ibs) in usd
  const availableAmount: number = useMemo(() => {
    let totalBalance = 0;
    let totalIBCBalance = 0;

    chainIDs.forEach((chainID) => {
      const { minimalDenom, decimals, chainName } = getDenomInfo(chainID);
      const ibcBalances = getIBCBalances(
        balanceChains?.[chainID]?.list,
        minimalDenom,
        chainName
      );

      const usdPriceInfo: TokenInfo | undefined =
        tokensPriceInfo?.[minimalDenom]?.info;
      const usdDenomPrice = usdPriceInfo?.usd || 0;

      for (let i = 0; i < ibcBalances?.length; i++) {
        const ibcUsdDenomPrice = tokensPriceInfo?.[ibcBalances?.[i]?.balance.denom]?.info?.usd || 0

        totalIBCBalance +=
          parseBalance(
            [ibcBalances[i].balance],
            ibcBalances?.[i]?.decimals,
            ibcBalances?.[i]?.balance.denom
          ) * ibcUsdDenomPrice;
      }

      const balance = parseBalance(
        balanceChains?.[chainID]?.list || [],
        decimals,
        minimalDenom
      );

      if (balanceChains?.[chainID]?.list?.length > 0) {
        totalBalance += usdDenomPrice * balance;
      }

    });

    return totalBalance + totalIBCBalance;
  }, [chainIDs, balanceChains, getDenomInfo, tokensPriceInfo]);

  // calculates rewards amount in usd
  const rewardsAmount = useMemo(() => {
    let totalRewardsAmount = 0;
    chainIDs.forEach((chainID) => {
      const rewards =
        rewardsChains?.[chainID]?.delegatorRewards?.totalRewards || 0;
      if (rewards > 0) {
        const { decimals, minimalDenom } = getDenomInfo(chainID);
        const usdPriceInfo: TokenInfo | undefined =
          tokensPriceInfo?.[minimalDenom]?.info;
        const usdDenomPrice = usdPriceInfo?.usd || 0;
        totalRewardsAmount += (rewards / 10 ** decimals) * usdDenomPrice;
      }
    });

    return totalRewardsAmount;
  }, [chainIDs, rewardsChains, getDenomInfo, tokensPriceInfo]);

   /* eslint-disable @typescript-eslint/no-explicit-any */
  const totalAmountByChain : any = () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const totalAmountByChainObj: any = {}

    chainIDs.forEach((chainID) => {
      let rewardsAmt = 0, availableAmt = 0, stakeAmt = 0, unstakeAmt = 0, ibcAmt = 0;
      const rewards =
        rewardsChains?.[chainID]?.delegatorRewards?.totalRewards || 0;
      if (rewards > 0) {
        const { decimals, minimalDenom } = getDenomInfo(chainID);
        const usdPriceInfo: TokenInfo | undefined =
          tokensPriceInfo?.[minimalDenom]?.info;
        const usdDenomPrice = usdPriceInfo?.usd || 0;
        rewardsAmt = (rewards / 10 ** decimals) * usdDenomPrice || 0;
      }

      const { minimalDenom, decimals, chainName } = getDenomInfo(chainID);
      const ibcBalances = getIBCBalances(
        balanceChains?.[chainID]?.list,
        minimalDenom,
        chainName
      );

      const usdPriceInfo: TokenInfo | undefined =
        tokensPriceInfo?.[minimalDenom]?.info;
      const usdDenomPrice = usdPriceInfo?.usd || 0;

      for (let i = 0; i < ibcBalances?.length; i++) {
        const ibcUsdDenomPrice = tokensPriceInfo?.[ibcBalances?.[i]?.balance.denom]?.info?.usd || 0

        const totalIBCBalance =
          parseBalance(
            [ibcBalances[i].balance],
            ibcBalances?.[i]?.decimals,
            ibcBalances?.[i]?.balance.denom
          ) * ibcUsdDenomPrice;

        ibcAmt = totalIBCBalance || 0;
      }

      const balance = parseBalance(
        balanceChains?.[chainID]?.list || [],
        decimals,
        minimalDenom
      );

      if (balanceChains?.[chainID]?.list?.length > 0) {
        const totalBalance = usdDenomPrice * balance;
        availableAmt = totalBalance || 0;
      }


      const unStaked = stakingChains?.[chainID]?.unbonding?.totalUnbonded || 0;
      if (unStaked > 0) {
        const { decimals, minimalDenom } = getDenomInfo(chainID);
        const usdPriceInfo: TokenInfo | undefined =
          tokensPriceInfo?.[minimalDenom]?.info;
        const usdDenomPrice = usdPriceInfo?.usd || 0;
        const totalUnStakedAmount = (unStaked / 10 ** decimals) * usdDenomPrice;
        unstakeAmt = totalUnStakedAmount || 0;
      }


      const staked = stakingChains?.[chainID]?.delegations?.totalStaked || 0;

      if (staked > 0) {
        const { decimals, minimalDenom } = getDenomInfo(chainID);
        const usdPriceInfo: TokenInfo | undefined =
          tokensPriceInfo?.[minimalDenom]?.info;
        const usdDenomPrice = usdPriceInfo?.usd || 0;
        const totalStakedAmount = (staked / 10 ** decimals) * usdDenomPrice;

        stakeAmt = totalStakedAmount || 0;
      }


      const allNetworks = useAppSelector((state) => state.common.allNetworksInfo);
      const logoUrl = allNetworks[chainID]?.logos?.menu
      const chainConfig = allNetworks[chainID]?.config
      totalAmountByChainObj[chainID] = {
        total: stakeAmt + rewardsAmt + ibcAmt + unstakeAmt + availableAmt,
        logoUrl: logoUrl,
        chainName: chainConfig?.chainName,
        theme: chainConfig?.theme
      }

    });



    console.log({ totalAmountByChainObj })

    return totalAmountByChainObj

  }

  // totalAmountByChain()


  return [totalStakedAmount, availableAmount, rewardsAmount, totalUnStakedAmount, totalAmountByChain];
};

export default useGetAssetsAmount;
