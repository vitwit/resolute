import { parseBalance } from '@/utils/denom';
import { useMemo } from 'react';
import { useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import chainDenoms from '@/utils/chainDenoms.json';
const chainDenomsData = chainDenoms as AssetData;

const useSortedAssets = (): [ParsedAsset[]] => {
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const balanceChains = useAppSelector(
    (state: RootState) => state.bank.balances
  );
  const stakingChains = useAppSelector(
    (state: RootState) => state.staking.chains
  );
  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainIDs = Object.keys(nameToChainIDs).map(
    (chainName) => nameToChainIDs[chainName]
  );

  const sortedAssets = useMemo(() => {
    let sortedAssets: ParsedAsset[] = [];

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
        let asset: ParsedAsset | undefined;
        if (balance.denom === nativeMinimalDenom) {
          const config = networks?.[chainID]?.network?.config;
          const currency = config?.currencies?.[0];
          const minimalDenom = currency?.coinMinimalDenom;
          const coinDenom = currency?.coinDenom;
          const decimals = currency?.coinDecimals || 0;
          // minimalDenom
          const stakedAmountInMinDenoms: number =
            stakingChains?.[chainID]?.delegations?.totalStaked || 0;

          // Todo: distribution slice
          const rewardsAmountInMinDenoms: number = 0;
          const stakedAmountInDenoms = stakedAmountInMinDenoms / 10 ** decimals;
          const rewardsAmountInDenoms =
            rewardsAmountInMinDenoms / 10 ** decimals;

          //Todo: common slice
          const denomPrice = 1;
          const inflation = '+2%';
          const balanceAmountInDenoms = parseBalance(
            balanceChains?.[chainID]?.list || [],
            decimals,
            minimalDenom
          );
          asset = {
            type: 'native',
            chainName: chainName,
            usdValue:
              denomPrice * (balanceAmountInDenoms +
              stakedAmountInDenoms +
              rewardsAmountInDenoms),
            usdPrice: denomPrice,
            inflation: inflation,
            chainID: chainID,
            displayDenom: coinDenom,
            balance: balanceAmountInDenoms,
            staked: stakedAmountInDenoms,
            rewards: rewardsAmountInDenoms,
            denom: minimalDenom,
          };
        } else if (denomInfo?.length) {
          // Todo
          const usdDenomPrice = 1;
          const inflation = '-1%';
          const balanceAmount = parseBalance(
            [balance],
            denomInfo[0].decimals,
            balance.denom
          );
          const usdDenomValue = usdDenomPrice * balanceAmount;
          asset = {
            type: 'ibc',
            usdValue: usdDenomValue,
            usdPrice: usdDenomPrice,
            balance: balanceAmount,
            denom: denomInfo[0].origin_denom,
            displayDenom: denomInfo[0].symbol,
            chainName: chainName,
            denomInfo: denomInfo,
            inflation: inflation,
            chainID: chainID,
          };
        }
        if (asset && asset.usdPrice) {
          sortedAssets = [...sortedAssets, asset];
        }
      });
    });

    sortedAssets.sort((x, y) => y.usdValue - x.usdValue);

    return sortedAssets;
  }, [chainIDs, balanceChains, networks]);

  return [sortedAssets];
};

export default useSortedAssets;
