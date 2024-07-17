import { useAppSelector } from '../StateHooks';
import useGetChainInfo from '../useGetChainInfo';
import chainDenoms from '@/utils/chainDenoms.json';
import { parseBalance } from '@/utils/denom';

interface IBCAsset {
  amount: number;
  displayDenom: string;
  minimalDenom: string;
  decimals: number;
  amountInDenom: number;
}

const chainDenomsData = chainDenoms as AssetData;

const useGetIBCAssets = () => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const multisigBalances = useAppSelector(
    (state) => state.multisig.balance.balance
  );

  const getIBCAssets = (chainID: string) => {
    const { chainName } = getChainInfo(chainID);
    const { minimalDenom: nativeMinimalDenom } = getDenomInfo(chainID);
    const ibcAssets: IBCAsset[] = [];
    multisigBalances.forEach((balance) => {
      const denomInfo = chainDenomsData[chainName.toLowerCase()]?.filter(
        (denomInfo) => {
          return denomInfo.denom === balance.denom;
        }
      );
      if (nativeMinimalDenom !== denomInfo[0].denom) {
        const { symbol, decimals, origin_denom } = denomInfo[0];
        ibcAssets.push({
          amount: Number(balance.amount),
          amountInDenom: parseBalance(
            [{ amount: balance.amount, denom: origin_denom }],
            decimals,
            origin_denom
          ),
          decimals: decimals,
          displayDenom: symbol,
          minimalDenom: origin_denom,
        });
      }
    });
    return { ibcAssets };
  };

  return { getIBCAssets };
};

export default useGetIBCAssets;
