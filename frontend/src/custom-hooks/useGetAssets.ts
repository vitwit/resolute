import { createSkipRouterClient } from '@/store/features/swaps/swapsService';
import { AssetConfig } from '@/types/swaps';
import { Asset } from '@skip-router/core';
import { useEffect, useState } from 'react';
import { TokenData } from '@0xsquid/sdk/dist/types';
import axios from 'axios';
import { SQUID_ID } from '@/utils/constants';

const useGetAssets = () => {
  const skipClient = createSkipRouterClient();
  const [assetsInfo, setAssetsInfo] = useState<TokenData[]>([]);
  const [chainWiseAssetOptions, setChainWiseAssetsOptions] = useState<
    Record<string, AssetConfig[]>
  >({});
  const [loading, setLoading] = useState(true);

  const fetchAssetsInfo = async (chainID: string) => {
    try {
      const result = await axios.get(
        `https://api.0xsquid.com/v1/tokens?chainId=${chainID}`,
        {
          headers: {
            'x-integrator-id': SQUID_ID,
          },
        }
      );
      const assets: TokenData[] = result.data.tokens;
      setAssetsInfo(assets);
      return assets;
    } catch (error) {
      console.log('error while fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const getTokensByChainID = async (chainID: string) => {
    const assets = await fetchAssetsInfo(chainID);
    const formattedAssets = assets ? getFormattedAssetsList(assets) : [];
    return formattedAssets;
  };
  return {
    getTokensByChainID,
    loading,
  };
};

const getFormattedAssetsList = (data: TokenData[]): AssetConfig[] => {
  const assetsList = data
    .map((asset): AssetConfig => {
      return {
        symbol: asset.symbol || '',
        label: asset.ibcDenom || '',
        logoURI: asset.logoURI || '',
        denom: asset.ibcDenom || '',
        decimals: asset.decimals || 0,
      };
    })
    .sort((assetA, assetB) => {
      return assetA.label.localeCompare(assetB.label);
    });
  return assetsList;
};

export default useGetAssets;
