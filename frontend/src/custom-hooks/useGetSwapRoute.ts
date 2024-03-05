import { createSkipRouterClient } from '@/store/features/ibc/ibcService';
import { Chain } from '@/types/swaps';
import { Asset, RouteResponse } from '@skip-router/core';
import React, { useEffect, useState } from 'react';

declare let window: WalletWindow;

const useGetSwapRoute = () => {
  console.log('2222222');
  const skipClient = createSkipRouterClient();
  const [route, setRoute] = useState<RouteResponse>();
  const [intermediateAddresss, setIntermediateAddresss] = useState({});
  const useRoute = ({
    amountIn,
    destAssetChainID,
    destAssetDenom,
    sourceAssetChainID,
    sourceAssetDenom,
  }: {
    amountIn: string;
    sourceAssetChainID: string;
    sourceAssetDenom: string;
    destAssetChainID: string;
    destAssetDenom: string;
  }) => {
    (async () => {
      const res = await skipClient.route({
        amountIn,
        sourceAssetChainID,
        sourceAssetDenom,
        destAssetChainID,
        destAssetDenom,
        cumulativeAffiliateFeeBPS: '0',
        allowUnsafe: true,
        experimentalFeatures: ['cctp'],
        clientID: '',
        allowMultiTx: true,
      });
      setRoute(res);
      const addresses: Record<string, string> = {};
      ``;
      for (const chainID of res?.chainIDs) {
        const account = await window.wallet.getKey(chainID);
        addresses[chainID] = account.bech32Address;
      }

      // for destination
      const destAccountInfo = await window.wallet.getKey(destAssetChainID);
      addresses[destAssetChainID] = destAccountInfo?.bech32Address || '';
      setIntermediateAddresss(addresses);
    })();
    return {
      route,
      intermediateAddresss,
    };
  };
  return { useRoute };
};

export default useGetSwapRoute;
