import { AssetConfig } from '@/types/swaps';
import { useState } from 'react';
import { TokenData } from '@0xsquid/sdk/dist/types';
import axios from 'axios';
import { SQUID_CLIENT_API, SQUID_ID } from '@/utils/constants';
import { cleanURL } from '@/utils/util';

const useGetAssets = () => {
  const [srcAssetsLoading, setSrcAssetsLoading] = useState(false);
  const [destAssetLoading, setDestAssetsLoading] = useState(false);

  const fetchAssetsInfo = async (chainID: string, isSource: boolean) => {
    try {
      if (isSource) {
        setSrcAssetsLoading(true);
      } else {
        setDestAssetsLoading(true);
      }
      const result = await axios.get(
        `${cleanURL(SQUID_CLIENT_API)}/v1/tokens?chainId=${chainID}`,
        {
          headers: {
            'x-integrator-id': SQUID_ID,
          },
        }
      );
      const assets: TokenData[] = result.data.tokens;
      return assets;
    } catch (error) {
      console.log('error while fetching data', error);
    } finally {
      if (isSource) {
        setSrcAssetsLoading(false);
      } else {
        setDestAssetsLoading(false);
      }
    }
  };

  const getTokensByChainID = async (chainID: string, isSource: boolean) => {
    if (!chainID?.length) return [];
    const assets = await fetchAssetsInfo(chainID, isSource);
    const formattedAssets = assets ? getFormattedAssetsList(assets) : [];
    return formattedAssets;
  };
  return {
    getTokensByChainID,
    srcAssetsLoading,
    destAssetLoading,
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
        name: asset.name || '',
      };
    })
    .sort((assetA, assetB) => {
      return assetA.label.localeCompare(assetB.label);
    });
  return assetsList;
};

export default useGetAssets;
