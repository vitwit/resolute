import { useCallback } from 'react';
import { RootState } from '@/store/store';
import { useAppSelector } from './StateHooks';
import { COSMOS_CHAIN_ID } from '@/utils/constants';

export interface DenomInfo {
  minimalDenom: string;
  decimals: number;
  chainName: string;
}

export interface OriginDenomInfo {
  originDenom: string;
  decimals: number;
  chainName: string;
  chainID: string;
}

const useGetChainInfo = () => {
  const networks = useAppSelector((state: RootState) => state.wallet.networks);

  const getDenomInfo = useCallback(
    (chainID: string): DenomInfo => {
      const config = networks?.[chainID]?.network?.config;
      const currency = config?.currencies?.[0];
      const chainName = config?.chainName.toLowerCase();

      return {
        minimalDenom: currency.coinMinimalDenom,
        decimals: currency.coinDecimals || 0,
        chainName,
      };
    },
    [networks]
  );

  const getChainInfo = (chainID: string): BasicChainInfo => {
    const network = networks[chainID].network;
    const config = network.config;
    const rest = config.rest;
    const rpc = config.rpc;

    const aminoCfg = network.aminoConfig;
    const cosmosAddress = networks[COSMOS_CHAIN_ID].walletInfo.bech32Address;
    const prefix = config.bech32Config.bech32PrefixAccAddr;
    const feeAmount = config.feeCurrencies[0].gasPriceStep?.average || 0;
    const address = networks[chainID].walletInfo.bech32Address;
    return {
      baseURL: rest,
      chainID,
      aminoConfig: aminoCfg,
      rest,
      rpc,
      cosmosAddress,
      prefix,
      feeAmount,
      address,
    };
  };

  const getOriginDenomInfo = (minimalDenom: string): OriginDenomInfo => {
    const chainIDs = Object.keys(networks);
    let originDenomInfo: OriginDenomInfo = {
      chainID: '-',
      chainName: '-',
      decimals: 0,
      // when the given minimalDenom is missing or unknown
      originDenom: 'Unknown-Token',
    };
    chainIDs.forEach((chainID) => {
      const config = networks[chainID].network.config;
      const currency = config.stakeCurrency;
      const { coinDecimals, coinDenom, coinMinimalDenom } = currency;
      if (coinMinimalDenom === minimalDenom) {
        originDenomInfo = {
          chainID,
          chainName: config.chainName,
          originDenom: coinDenom,
          decimals: coinDecimals,
        };
        return;
      }
    });
    return originDenomInfo;
  };

  return { getDenomInfo, getChainInfo, getOriginDenomInfo };
};

export default useGetChainInfo;
