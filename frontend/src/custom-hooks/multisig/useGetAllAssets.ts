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
  const accountBalances = useAppSelector((state) => state.bank.balances);

  const getAllAssets = (
    chainID: string,
    includeNative: boolean,
    isMultisig: boolean
  ) => {
    const { chainName } = getChainInfo(chainID);
    const {
      minimalDenom: nativeMinimalDenom,
      displayDenom,
      decimals: nativeDecimals,
    } = getDenomInfo(chainID);
    const allAssets: MultisigAsset[] = [];
    const balances = isMultisig
      ? multisigBalances
      : accountBalances?.[chainID].list;
    balances.forEach((balance) => {
      const denomInfo = chainDenomsData[chainName.toLowerCase()]?.filter(
        (denomInfo) => {
          return denomInfo.denom === balance.denom;
        }
      );
      const isNativeDenom = balance.denom === nativeMinimalDenom;
      if (!isNativeDenom && !denomInfo?.length) {
        return;
      }
      const assetData = {
        symbol: isNativeDenom ? displayDenom : denomInfo?.[0].symbol,
        decimals: isNativeDenom ? nativeDecimals : denomInfo?.[0].decimals,
        originDenom: isNativeDenom ? nativeMinimalDenom : denomInfo?.[0].denom,
        ibcDenom: isNativeDenom ? nativeMinimalDenom : denomInfo?.[0].denom,
      };
      if (
        assetData.symbol &&
        assetData.decimals &&
        assetData.originDenom &&
        assetData.ibcDenom
      ) {
        const assetInfo = {
          amount: Number(balance.amount),
          amountInDenom: parseBalance(
            [{ amount: balance.amount, denom: assetData.originDenom }],
            assetData.decimals,
            assetData.originDenom
          ),
          decimals: assetData.decimals,
          displayDenom: assetData.symbol,
          minimalDenom: assetData.originDenom,
          ibcDenom: assetData.ibcDenom,
        };
        if (includeNative || nativeMinimalDenom !== assetData.originDenom) {
          allAssets.push(assetInfo);
        }
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
    const {
      minimalDenom: nativeMinimalDenom,
      displayDenom,
      decimals: nativeDecimals,
    } = getDenomInfo(chainID);
    const denomInfo = chainDenomsData[chainName.toLowerCase()]?.filter(
      (denomInfo) => {
        return denomInfo.denom === denom;
      }
    );
    const isNativeDenom = denom === nativeMinimalDenom;
    if (!denomInfo?.length && !isNativeDenom) {
      return { assetInfo: null };
    }
    const assetData = {
      symbol: isNativeDenom ? displayDenom : denomInfo?.[0].symbol,
      decimals: isNativeDenom ? nativeDecimals : denomInfo?.[0].decimals,
      originDenom: isNativeDenom ? nativeMinimalDenom : denomInfo?.[0].denom,
    };
    if (assetData.decimals && assetData.symbol && assetData.originDenom) {
      const assetInfo = {
        amountInDenom: parseBalance(
          [{ amount, denom: assetData.originDenom }],
          assetData.decimals,
          assetData.originDenom
        ),
        displayDenom: assetData.symbol,
      };
      return { assetInfo };
    }
    return { assetInfo: null };
  };

  return { getAllAssets, getParsedAsset };
};

export default useGetAllAssets;
