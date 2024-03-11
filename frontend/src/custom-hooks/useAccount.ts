import React from 'react';
import { useAppSelector } from './StateHooks';
import { Asset } from '@skip-router/core';
import useGetAssets from './useGetAssets';

declare let window: WalletWindow;

const useAccount = () => {
  const balances = useAppSelector((state) => state.bank.balances);
  const { assetsInfo } = useGetAssets();
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
  }: {
    chainID: string;
    denom: string;
  }) => {
    const chainBalances = balances?.[chainID].list || [];

    const balanceInfo = {
      amount: 0,
      minimalDenom: '',
      displayDenom: '',
      decimals: 0,
      parsedAmount: 0,
    };

    const chainAssets = assetsInfo?.[chainID];

    chainBalances.forEach((balance) => {
      const filteredDenomInfo = chainAssets?.filter((denomInfo) => {
        return denomInfo.denom === balance.denom;
      });
      const denomInfo = filteredDenomInfo[0];
      if (denomInfo && denomInfo.originDenom === denom) {
        balanceInfo.amount = parseFloat(balance.amount);
        const precision = denomInfo.decimals || 0 > 6 ? 6 : denomInfo.decimals;
        balanceInfo.decimals = denomInfo.decimals || 0;
        balanceInfo.displayDenom = denomInfo.symbol || '';
        balanceInfo.minimalDenom = denomInfo.denom;

        balanceInfo.parsedAmount = parseFloat(
          (Number(balance.amount) / 10.0 ** (denomInfo.decimals || 0)).toFixed(
            precision
          )
        );
      }
    });

    return {
      balanceInfo,
    };
  };

  return { getAccountAddress, getAvailableBalance };
};

export default useAccount;
