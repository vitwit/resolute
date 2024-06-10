import { useCallback } from 'react';
import { RootState } from '@/store/store';
import { useAppSelector } from './StateHooks';
import { getAddressByPrefix } from '@/utils/address';
import { USD_CURRENCY } from '@/utils/constants';

export interface DenomInfo {
  minimalDenom: string;
  decimals: number;
  chainName: string;
  displayDenom: string;
}

const useGetChainInfo = () => {
  const networks = useAppSelector((state: RootState) => state.wallet.networks);
  const allNetworks = useAppSelector((state) => state.common.allNetworksInfo);
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const balanceChains = useAppSelector(
    (state: RootState) => state.bank.balances
  );

  const tokensPriceInfo = useAppSelector(state => state.common.allTokensInfoState.info)

  const getCosmosAddress = () => {
    const chainID = Object.keys(networks)[0];
    const address = networks?.[chainID]?.walletInfo?.bech32Address;
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
    let network: Network;
    if (isWalletConnected) {
      network = networks?.[chainID]?.network;
    } else {
      network = allNetworks?.[chainID];
    }
    const config = network?.config;
    const rest = config?.rest;
    const rpc = config?.rpc;
    const chainName = config?.chainName.toLowerCase();

    const aminoCfg = network &&  network?.aminoConfig;
    const cosmosAddress = getCosmosAddress();
    const prefix = config && config?.bech32Config.bech32PrefixAccAddr;
    const valPrefix = config && config?.bech32Config.bech32PrefixValAddr;
    const feeAmount = config?.feeCurrencies[0].gasPriceStep?.average || 0;
    const decimals = config?.feeCurrencies[0].coinDecimals || 0;
    const address = networks?.[chainID]?.walletInfo?.bech32Address || '';
    const feeCurrencies = config?.feeCurrencies;
    const explorerTxHashEndpoint = network?.explorerTxHashEndpoint;
    const chainLogo = network?.logos?.menu;
    const govV1 = network?.govV1;

    return {
      restURLs: config?.restURIs,
      rpcURLs: config?.rpcURIs,
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
      valPrefix,
      govV1,
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

  const getAllChainAddresses = (chainIDs: string[]) => {
    let addresses: {
      chain_id: string;
      address: string;
    }[] = [];
    chainIDs.forEach((chainID) => {
      const { address } = getChainInfo(chainID);
      addresses = [...addresses, { chain_id: chainID, address: address }];
    });

    return addresses;
  };

  const getChainNamesAndLogos = () => {
    if (isWalletConnected) {
      const chainIDs = Object.keys(networks);
      const chainNamesAndLogos = chainIDs.map((chainID) => {
        const { chainName } = networks[chainID].network.config;
        const { chainLogo } = getChainInfo(chainID);
        return { chainID, chainName, chainLogo };
      });
      return chainNamesAndLogos;
    } else {
      const chainIDs = Object.keys(allNetworks);
      const chainNamesAndLogos = chainIDs.map((chainID) => {
        const { chainName } = allNetworks[chainID].config;
        const { menu: chainLogo } = allNetworks[chainID].logos;
        return { chainID, chainName, chainLogo };
      });
      return chainNamesAndLogos;
    }
  };

  // will return actual value of token with denomination and 
  // usd value based on  amount and minimal denom

  const getValueFromToken = (chainId: string, amount: number, denom: string)  => {
  
    const denomInfo = getOriginDenomInfo(denom)

    const tokenPrice = tokensPriceInfo[denom]?.info?.[USD_CURRENCY]

    return {
      amount: amount * 10 ** -denomInfo.decimals,
      displayDenom: denomInfo.originDenom,
      usdValue: amount * tokenPrice
    }
  }


  const getTokenValueByChainId = (chainID: string, amount: number)  => {
    const denomInfo = getDenomInfo(chainID)

    const tokenPrice = tokensPriceInfo[denomInfo.minimalDenom]?.info?.[USD_CURRENCY]

    return {
      amount: amount * 10 ** -denomInfo.decimals,
      displayDenom: denomInfo.displayDenom,
      usdValue: amount * tokenPrice
    }
  }

  return {
    getDenomInfo,
    getChainInfo,
    getOriginDenomInfo,
    isNativeTransaction,
    getChainIDFromAddress,
    isFeeAvailable,
    getCosmosAddress,
    getAllChainAddresses,
    getChainNamesAndLogos,
    getValueFromToken,
    getTokenValueByChainId,
  };
};

export default useGetChainInfo;
