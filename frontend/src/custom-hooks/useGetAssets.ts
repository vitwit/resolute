import { createSkipRouterClient } from '@/store/features/ibc/ibcService';
import { Chain } from '@/types/swaps';
import { Asset } from '@skip-router/core';
import React, { useEffect, useState } from 'react';

const useGetAssets = () => {
  const skipClient = createSkipRouterClient();
  const [assetsInfo, setAssetsInfo] = useState<Record<string, Asset[]>>({});

  useEffect(() => {
    (async () => {
      const assets = await skipClient.assets();
      setAssetsInfo(assets);
    })();
  }, []);
  return {
    assetsInfo,
  };
};

export default useGetAssets;
