import { parseBalance } from '@/utils/denom';
import { useMemo } from 'react';
import { useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';

const useGetSortedChainIDs = () => {
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

  const sortedChainIds = useMemo(() => {
    let sortedChains: { chainID: string; usdValue: number }[] = [];
    chainIDs.forEach((chainID) => {
      const config = networks?.[chainID]?.network?.config;
      const currency = config?.currencies?.[0];
      const minimalDenom = currency?.coinMinimalDenom;
      const decimals = currency?.coinDecimals || 0;
      const balanceAmountInDenoms = parseBalance(
        balanceChains?.[chainID]?.list || [],
        decimals,
        minimalDenom
      );

      // minimalDenom
      const stakedAmountInDenoms: number =
        stakingChains?.[chainID]?.delegations?.totalStaked || 0;

      // Todo: distribution slice
      const rewardsAmountInDenoms: number = 0;
      const chain: { chainID: string; usdValue: number } = {
        chainID,
        usdValue: 0,
      };
      // Todo: denom price from common slice
      const denomPrice = 1;
      chain.usdValue =
        denomPrice *
        (balanceAmountInDenoms +
          stakedAmountInDenoms / 10 ** decimals +
          (rewardsAmountInDenoms / 10) * decimals);
      if (chain.usdValue) sortedChains = [...sortedChains, chain];
    });

    sortedChains.sort((x, y) => y.usdValue - x.usdValue);
    return sortedChains.map((chain) => chain.chainID);
  }, [chainIDs, networks, balanceChains, stakingChains]);

  return [sortedChainIds];
};

export default useGetSortedChainIDs;
