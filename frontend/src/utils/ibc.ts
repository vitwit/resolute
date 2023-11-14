import chainDenoms from './chainDenoms.json';
import { Coin, coin } from '@cosmjs/amino';

const chainDenomsData = chainDenoms as AssetData;

export const getIBCBalances = (
  balancesList: Coin[],
  nativeDenom: string,
  chainName: string
): { balance: Coin; decimals: number }[] => {
  let ibcBalances: { balance: Coin; decimals: number }[] = [];
  for (let i = 0; i < balancesList?.length; i++) {
    if (balancesList[i]?.denom === nativeDenom) continue;
    const denomInfo = getOriginDenom(balancesList[i], chainName);
    ibcBalances = [
      ...ibcBalances,
      {
        balance: coin(Number(balancesList[i]?.amount), denomInfo?.origin_denom),
        decimals: denomInfo?.decimals,
      },
    ];
  }
  return ibcBalances;
};

export const getOriginDenom = (
  balance: Coin,
  chainName: string
): { origin_denom: string; decimals: number } => {
  const denomInfo = chainDenomsData[chainName]?.filter((item) => {
    return balance?.denom === item.denom;
  });
  return {
    origin_denom: denomInfo?.[0]?.origin_denom,
    decimals: denomInfo?.[0]?.decimals,
  };
};
