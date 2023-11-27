import { useCallback } from 'react';
import { RootState } from '@/store/store';
import { useAppSelector } from './StateHooks';

export interface DenomInfo {
  minimalDenom: string;
  decimals: number;
  chainName: string;
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
    const rest = networks[chainID].network.config.rest;
    const rpc = networks[chainID].network.config.rpc;
    const aminoCfg = networks[chainID].network.aminoConfig;
    const cosmosAddress = networks['cosmoshub-4'].walletInfo.bech32Address;
    const prefix =
      networks[chainID].network.config.bech32Config.bech32PrefixAccAddr;
    const feeAmount =
      networks[chainID].network.config.feeCurrencies[0].gasPriceStep?.average ||
      0;
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
  return { getDenomInfo, getChainInfo };
};

export default useGetChainInfo;
