import React from 'react';
import { useAppSelector } from './StateHooks';
import chainDenoms from '@/utils/chainDenoms.json';

const chainDenomsData = chainDenoms as AssetData;

declare let window: WalletWindow;

const useAccount = () => {
  const balances = useAppSelector((state) => state.bank.balances);
  const getAccountAddress = async (
    chainID: string
  ): Promise<{ address: string }> => {
    try {
      const account = await window.wallet.getKey(chainID);
      return { address: account.bech32Address };
    } catch (error) {
      const account = await window.wallet.experimentalSuggestChain(chainID);
      return { address: account.bech32Address };
    }
  };

  const getAvailableBalance = ({
    chainID,
    denom,
    chainName,
  }: {
    chainID: string;
    denom: string;
    chainName: string;
  }) => {
    const chainBalances = balances?.[chainID].list || [];

    const balanceInfo = {
      amount: 0,
      minimalDenom: '',
      displayDenom: '',
      decimals: 0,
      parsedAmount: 0,
    };
    chainBalances.forEach((balance) => {
      const filteredDenomInfo = chainDenomsData[chainName]?.filter(
        (denomInfo) => {
          return denomInfo.denom === balance.denom;
        }
      );

      let denomInfo;
      if (isIBCAsset(filteredDenomInfo[0])) {
        denomInfo = filteredDenomInfo[0] as IBCAsset;
        if (denomInfo.counter_party.denom === denom) {
          balanceInfo.amount = parseFloat(balance.amount);
          const precision = denomInfo.decimals > 6 ? 6 : denomInfo.decimals;
          balanceInfo.decimals = denomInfo.decimals;
          balanceInfo.displayDenom = denomInfo.symbol;
          balanceInfo.minimalDenom = denomInfo.counter_party.denom;

          balanceInfo.parsedAmount = parseFloat(
            (Number(balance.amount) / 10.0 ** denomInfo.decimals).toFixed(
              precision
            )
          );
        }
      } else {
        denomInfo = filteredDenomInfo[0] as NativeAsset;
        if (denomInfo.origin_denom === denom) {
          balanceInfo.amount = parseFloat(balance.amount);
          const precision = denomInfo.decimals > 6 ? 6 : denomInfo.decimals;
          balanceInfo.decimals = denomInfo.decimals;
          balanceInfo.displayDenom = denomInfo.symbol;
          balanceInfo.minimalDenom = denomInfo.origin_denom;

          balanceInfo.parsedAmount = parseFloat(
            (Number(balance.amount) / 10.0 ** denomInfo.decimals).toFixed(
              precision
            )
          );
        }
      }
    });

    return {
      balanceInfo,
    };
  };

  return { getAccountAddress, getAvailableBalance };
};

function isIBCAsset(asset: NativeAsset | IBCAsset): asset is IBCAsset {
  return 'counter_party' in asset;
}

export default useAccount;
