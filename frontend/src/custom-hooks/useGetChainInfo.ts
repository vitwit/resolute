import { useCallback } from 'react';
import { RootState } from '@/store/store';
import { useAppSelector } from './StateHooks';
import { COSMOS_CHAIN_ID } from '@/utils/constants';
import { getAddressByPrefix } from '@/utils/address';

export interface DenomInfo {
  minimalDenom: string;
  decimals: number;
  chainName: string;
  displayDenom: string;
}

const useGetChainInfo = () => {
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const balanceChains = useAppSelector(
    (state: RootState) => state.bank.balances
  );

  const getCosmosAddress = () => {
    const chainID = Object.keys(networks)[0];
    const address = networks[chainID].walletInfo.bech32Address;
    return getAddressByPrefix(address, 'cosmos');
  };

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

  const isFeeAvailable = (chainID: string) => {
    const { minimalDenom, decimals } = getDenomInfo(chainID);
    const { feeAmount } = getChainInfo(chainID);
    let isEnoughFee = false;
    balanceChains[chainID].list.forEach((token) => {
      if (
        token.denom === minimalDenom &&
        +token.amount >= feeAmount * 10 ** decimals
      )
        isEnoughFee = true;
    });
    return isEnoughFee;
  };

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
    const decimals = config.feeCurrencies[0].coinDecimals || 0;
    const address = networks[chainID]?.walletInfo.bech32Address;
    const feeCurrencies = config?.feeCurrencies;
    const explorerTxHashEndpoint = network?.explorerTxHashEndpoint;
    const chainLogo = networks[chainID].network.logos.menu;

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
      chainLogo,
      decimals,
    };
  };

  const getOriginDenomInfo = (minimalDenom: string): OriginDenomInfo => {
    const chainIDs = Object.keys(networks);
    let originDenomInfo: OriginDenomInfo = {
      chainID: '-',
      chainName: '-',
      decimals: 0,
      chainLogo: '-',
      // when the given minimalDenom is missing or unknown
      originDenom: 'Unknown-Token',
    };
    chainIDs.forEach((chainID) => {
      const config = networks[chainID].network.config;
      const currency = config.stakeCurrency;
      const chainLogo = networks[chainID].network.logos.menu;
      const { coinDecimals, coinDenom, coinMinimalDenom } = currency;
      if (coinMinimalDenom === minimalDenom) {
        originDenomInfo = {
          chainID,
          chainLogo,
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
    isFeeAvailable,
    getCosmosAddress,
  };
};

export default useGetChainInfo;
