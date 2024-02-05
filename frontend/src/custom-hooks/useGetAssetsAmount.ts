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

  return [totalStakedAmount, availableAmount, rewardsAmount];
};

export default useGetAssetsAmount;
