import { createSkipRouterClient } from '@/store/features/swaps/swapsService';
import { Asset } from '@skip-router/core';
import React, { useEffect, useState } from 'react';

const useGetAssets = () => {
  const skipClient = createSkipRouterClient();
  const [assetsInfo, setAssetsInfo] = useState<Record<string, Asset[]>>({});
  const [chainWiseAssetOptions, setChainWiseAssetsOptions] = useState<
    Record<string, AssetConfig[]>
  >({});

  useEffect(() => {
    (async () => {
      const assets = await skipClient.assets();
      setAssetsInfo(assets);
      const chainWiseAssets: Record<string, AssetConfig[]> = {};

      Object.keys(assets).forEach((chainID) => {
        const formattedAssets = getFormattedAssetsList(assets[chainID]);
        chainWiseAssets[chainID] = formattedAssets;
      });
      setChainWiseAssetsOptions(chainWiseAssets);
    })();
  }, []);
  return {
    assetsInfo,
    chainWiseAssetOptions,
  };
};

const getFormattedAssetsList = (data: Asset[]): AssetConfig[] => {
  const assetsList = data
    .map((asset): AssetConfig => {
      return {
        symbol: asset.recommendedSymbol || '',
        label: asset.originDenom || '',
        logoURI: asset.logoURI || '',
      };
    })
    .sort((assetA, assetB) => {
      return assetA.label.localeCompare(assetB.label);
    });
  return assetsList;
};

export default useGetAssets;
