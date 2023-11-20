import { parseBalance } from '@/utils/denom';
import { useMemo } from 'react';
import { useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import chainDenoms from '@/utils/chainDenoms.json';
const chainDenomsData = chainDenoms as AssetData;

const useGetIBCSortedChainIDs = () => {
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const balanceChains = useAppSelector(
    (state: RootState) => state.bank.balances
  );
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  const IBCSortedChainIds = useMemo(() => {
    let sortedIBCChains: {
      usdValue: number;
      usdPrice: number;
      balanceAmount: number;
      chainName: string;
      denomInfo: (IBCAsset | NativeAsset)[];
    }[] = [];

    chainIDs.forEach((chainID) => {

      const config = networks?.[chainID]?.network?.config;
      const currency = config?.currencies?.[0];
      const chainName = config?.chainName.toLowerCase();
      const nativeMinimalDenom = currency.coinMinimalDenom;
      const chainBalances = balanceChains?.[chainID]?.list || [];

      chainBalances.forEach((balance) => {
        const denomInfo = chainDenomsData[chainName]?.filter((denomInfo) => {
          return denomInfo.denom === balance.denom;
        });
        if (balance?.denom !== nativeMinimalDenom && denomInfo?.length) {
          const usdDenomPrice = 1;
          const balanceAmount = parseBalance(
            [balance],
            denomInfo[0].decimals,
            balance.denom
          );
          const usdDenomValue = usdDenomPrice * balanceAmount
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
  }, [chainIDs, balanceChains, networks]);

  return [IBCSortedChainIds];
};

export default useGetIBCSortedChainIDs;
