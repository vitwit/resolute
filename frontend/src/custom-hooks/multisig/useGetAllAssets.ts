import { useAppSelector } from '../StateHooks';
import useGetChainInfo from '../useGetChainInfo';
import chainDenoms from '@/utils/chainDenoms.json';
import { parseBalance } from '@/utils/denom';

interface MultisigAsset {
  amount: number;
  displayDenom: string;
  minimalDenom: string;
  decimals: number;
  amountInDenom: number;
  ibcDenom: string;
}

const chainDenomsData = chainDenoms as AssetData;

const useGetAllAssets = () => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();

  const multisigBalances = useAppSelector(
    (state) => state.multisig.balance.balance
  );

  const getAllAssets = (chainID: string, includeNative: boolean) => {
    const { chainName } = getChainInfo(chainID);
    const { minimalDenom: nativeMinimalDenom } = getDenomInfo(chainID);
    const allAssets: MultisigAsset[] = [];
    multisigBalances.forEach((balance) => {
      const denomInfo = chainDenomsData[chainName.toLowerCase()]?.filter(
        (denomInfo) => {
          return denomInfo.denom === balance.denom;
        }
      );
      const { symbol, decimals, origin_denom } = denomInfo[0];
      const assetInfo = {
        amount: Number(balance.amount),
        amountInDenom: parseBalance(
          [{ amount: balance.amount, denom: origin_denom }],
          decimals,
          origin_denom
        ),
        decimals: decimals,
        displayDenom: symbol,
        minimalDenom: origin_denom,
        ibcDenom: denomInfo[0].denom,
      };
      if (includeNative || nativeMinimalDenom !== denomInfo[0].denom) {
        allAssets.push(assetInfo);
      }
    });
    return { allAssets };
  };

  const getParsedAsset = ({
    amount,
    chainID,
    denom,
  }: {
    chainID: string;
    amount: string;
    denom: string;
  }) => {
    const { chainName } = getChainInfo(chainID);
    const denomInfo = chainDenomsData[chainName.toLowerCase()]?.filter(
      (denomInfo) => {
        return denomInfo.denom === denom;
      }
    );
    if (!denomInfo?.length) {
      return { assetInfo: null };
    }
    const { symbol, decimals, origin_denom } = denomInfo?.[0];
    const assetInfo = {
      amountInDenom: parseBalance(
        [{ amount, denom: origin_denom }],
        decimals,
        origin_denom
      ),
      displayDenom: symbol,
    };
    return { assetInfo };
  };

  return { getAllAssets, getParsedAsset };
};

export default useGetAllAssets;
