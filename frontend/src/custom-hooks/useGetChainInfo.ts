import { useCallback } from 'react';
import { RootState } from '@/store/store';
import { useAppSelector } from './StateHooks';
import { COSMOS_CHAIN_ID } from '@/utils/constants';

export interface DenomInfo {
  minimalDenom: string;
  decimals: number;
  chainName: string;
  displayDenom: string;
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
        minimalDenom: currency?.coinMinimalDenom,
        decimals: currency?.coinDecimals || 0,
        chainName,
        displayDenom: currency?.coinDenom,
      };
    },
    [networks]
  );

  const getChainInfo = (chainID: string): BasicChainInfo => {
    const network = networks[chainID].network;
    const config = network.config;
    const rest = config.rest;
    const rpc = config.rpc;
    const chainName = config.chainName.toLowerCase();

    const aminoCfg = network?.aminoConfig;
    const cosmosAddress = networks[COSMOS_CHAIN_ID].walletInfo.bech32Address;
    const prefix = config?.bech32Config.bech32PrefixAccAddr;
    const feeAmount = config?.feeCurrencies[0].gasPriceStep?.average || 0;
    const address = networks[chainID]?.walletInfo.bech32Address;
    const feeCurrencies = config?.feeCurrencies;
    const explorerTxHashEndpoint = network?.explorerTxHashEndpoint;

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
      feeCurrencies,
      explorerTxHashEndpoint,
      chainName,
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

  const isNativeTransaction = (chainID: string, toAddress: string) => {
    const { prefix } = getChainInfo(chainID);
    if (toAddress.startsWith(prefix)) return true;
    // osmosis bech32Accountaddr prefix is not matching with address
    if (prefix === 'osmosis' && toAddress.startsWith('osmo')) return true;
    return false;
  };

  const getChainIDFromAddress = (address: string) => {
    for (const chainIDItem of Object.keys(networks)) {
      const prefix =
        networks[chainIDItem].network.config.bech32Config.bech32PrefixAccAddr;
      if (
        address.startsWith(prefix) ||
        (prefix === 'osmosis' && address.startsWith('osmo'))
      ) {
        return chainIDItem;
      }
    }
    return '';
  };

  return {
    getDenomInfo,
    getChainInfo,
    getOriginDenomInfo,
    isNativeTransaction,
    getChainIDFromAddress,
  };
};

export default useGetChainInfo;
