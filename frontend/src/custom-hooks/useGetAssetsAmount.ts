import { RootState } from '@/store/store';
import { useCallback, useMemo } from 'react';
import { useAppSelector } from './StateHooks';
import { parseBalance } from '@/utils/denom';
import { getIBCBalances } from '@/utils/ibc';

const useGetAssetsAmount = () => {
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );
  const stakingChains = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const balanceChains = useAppSelector(
    (state: RootState) => state.bank.balances
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
        const { decimals } = getDenomInfo(chainID);
        // Todo: common slice
        const denomPrice = 1;
        totalStakedAmount += (staked / 10 ** decimals) * denomPrice;
      }
    });
    return totalStakedAmount;
  }, [chainIDs, stakingChains, getDenomInfo]);

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

      // Todo: price
      const denomPrice = 1;

      for (let i = 0; i < ibcBalances?.length; i++) {
        totalIBCBalance +=
          parseBalance(
            [ibcBalances[i].balance],
            ibcBalances?.[i]?.decimals,
            ibcBalances?.[i]?.balance.denom
          ) * denomPrice;
      }

      const balance = parseBalance(
        balanceChains?.[chainID]?.list || [],
        decimals,
        minimalDenom
      );

      if (balanceChains?.[chainID]?.list?.length > 0) {
        totalBalance += denomPrice * balance;
      }
    });

    return totalBalance + totalIBCBalance;
  }, [chainIDs, balanceChains, getDenomInfo]);

  // calculates rewards amount in usd
  const rewardsAmount = useMemo(() => {
    // Todo: implement distribution slice
    return 0;
  }, []);

  return [totalStakedAmount, availableAmount, rewardsAmount];
};

export default useGetAssetsAmount;
