import { RootState } from '@/store/store';
import { useCallback, useMemo } from 'react';
import { useAppSelector } from './StateHooks';
import { parseBalance } from '@/utils/denom';
import { getIBCBalances } from '@/utils/ibc';

const useGetAssetsAmount = (chainIDs: string[]) => {
  const stakingChains = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const balanceChains = useAppSelector(
    (state: RootState) => state.bank.balances
  );
  const tokensPriceInfo = useAppSelector(
    (state) => state.common.allTokensInfoState.info
  );

  const getDenomInfo = useCallback(
    (
      chainID: string
    ): { minimalDenom: string; decimals: number; chainName: string } => {
      const config = networks?.[chainID]?.network?.config;
      const currency = config?.currencies?.[0];
      const chainName = config?.chainName.toLowerCase();

      return {
        minimalDenom: currency.coinMinimalDenom,
        decimals: currency.coinDecimals || 0,
        chainName,
      };
    },
    [networks]
  );

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
        totalIBCBalance +=
          parseBalance(
            [ibcBalances[i].balance],
            ibcBalances?.[i]?.decimals,
            ibcBalances?.[i]?.balance.denom
          ) * usdDenomPrice;
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
    // Todo: implement distribution slice
    return 0;
  }, []);

  return [totalStakedAmount, availableAmount, rewardsAmount];
};

export default useGetAssetsAmount;
