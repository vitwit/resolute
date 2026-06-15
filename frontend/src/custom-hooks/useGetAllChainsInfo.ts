import { useCallback } from 'react';
import { useAppSelector } from './StateHooks';
import { RootState } from '@/store/store';

export interface DenomInfo {
  minimalDenom: string;
  decimals: number;
  chainName: string;
  displayDenom: string;
}

const useGetAllChainsInfo = () => {
  const networks = useAppSelector(
    (state: RootState) => state.common.allNetworksInfo
  );

  const getAllDenomInfo = useCallback(
    (chainID: string): DenomInfo => {
      const config = networks?.[chainID]?.config;
      const currency = config?.currencies?.[0];
      const chainName = config?.chainName.toLowerCase();

      return {
        minimalDenom: currency?.coinMinimalDenom,
        decimals: currency?.coinDecimals || 0,
        chainName,
        displayDenom: currency?.coinDenom,
      };
    },
    [networks]
  );

  const getAllChainInfo = (chainID: string): AllChainInfo => {
    const network = networks[chainID];
    const config = network.config;
    const rest = config.rest;
    const rpc = config.rpc;
    const chainName = config.chainName.toLowerCase();

    const aminoCfg = network?.aminoConfig;
    const prefix = config?.bech32Config.bech32PrefixAccAddr;
    const valPrefix = config?.bech32Config.bech32PrefixValAddr;
    const feeAmount = config?.feeCurrencies[0].gasPriceStep?.average || 0;
    const decimals = config.feeCurrencies[0].coinDecimals || 0;
    const feeCurrencies = config?.feeCurrencies;
    const explorerTxHashEndpoint = network?.explorerTxHashEndpoint;
    const chainLogo = networks[chainID].logos.menu;

    return {
      restURLs: config.restURIs,
      baseURL: rest,
      chainID,
      aminoConfig: aminoCfg,
      rest,
      rpc,
      prefix,
      feeAmount,
      feeCurrencies,
      explorerTxHashEndpoint,
      chainName,
      chainLogo,
      decimals,
      valPrefix,
    };
  };

  return {
    getAllDenomInfo,
    getAllChainInfo,
  };
};

export default useGetAllChainsInfo;
