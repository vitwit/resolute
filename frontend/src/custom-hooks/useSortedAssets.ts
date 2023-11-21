import { parseBalance } from '@/utils/denom';
import { useMemo } from 'react';
import { useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';
import chainDenoms from '@/utils/chainDenoms.json';
const chainDenomsData = chainDenoms as AssetData;

const useSortedAssets = (chainIDs: string[]): [ParsedAsset[]] => {
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const balanceChains = useAppSelector(
    (state: RootState) => state.bank.balances
  );
  const stakingChains = useAppSelector(
    (state: RootState) => state.staking.chains
  );

  const tokensPriceInfo = useAppSelector(
    (state) => state.common.allTokensInfoState.info
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

          const usdPriceInfo: TokenInfo | undefined =
            tokensPriceInfo?.[minimalDenom]?.info;
          const usdDenomPrice = usdPriceInfo?.usd || 0;
          const inflation = usdPriceInfo?.usd_24h_change || 0;

          const balanceAmountInDenoms = parseBalance(
            balanceChains?.[chainID]?.list || [],
            decimals,
            minimalDenom
          );
          asset = {
            type: 'native',
            chainName: chainName,
            usdValue:
              usdDenomPrice *
              (balanceAmountInDenoms +
                stakedAmountInDenoms +
                rewardsAmountInDenoms),
            usdPrice: usdDenomPrice,
            inflation: inflation,
            chainID: chainID,
            displayDenom: coinDenom,
            balance: balanceAmountInDenoms,
            staked: stakedAmountInDenoms,
            rewards: rewardsAmountInDenoms,
            denom: minimalDenom,
          };
        } else if (denomInfo?.length) {
          const usdPriceInfo: TokenInfo | undefined =
            tokensPriceInfo?.[denomInfo[0].origin_denom]?.info;
          const usdDenomPrice = usdPriceInfo?.usd || 0;
          const inflation = usdPriceInfo?.usd_24h_change || 0;

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
  }, [chainIDs, balanceChains, networks, tokensPriceInfo]);

  return [sortedAssets];
};

export default useSortedAssets;
