import { createSkipRouterClient } from '@/store/features/swaps/swapsService';
import { useState } from 'react';
import { Squid } from '@0xsquid/sdk';
import { GetRoute, RouteResponse } from '@0xsquid/sdk/dist/types';

interface GetRouteInputs {
  sourceChainID: string;
  sourceDenom: string;
  destChainID: string;
  destDenom: string;
  amount: number;
  isAmountIn: boolean;
}

const useSwaps = () => {
  const [routeLoading, setRouteLoading] = useState(false);
  // const skipClient = createSkipRouterClient();
  const squidClient = new Squid();

  const getSwapRoute = async ({
    amount,
    destChainID,
    destDenom,
    sourceChainID,
    sourceDenom,
    isAmountIn,
  }: GetRouteInputs) => {
    const params: GetRoute = {
      fromAddress: 'cosmos1y0hvu8ts6m8hzwp57t9rhdgvnpc7yltglu9nrk',
      fromAmount: amount.toString(),
      fromChain: sourceChainID,
      fromToken: sourceDenom,
      toAddress: 'osmo1y0hvu8ts6m8hzwp57t9rhdgvnpc7yltgh8kr4y',
      toChain: destChainID,
      toToken: destDenom,
      slippage: 1,
      quoteOnly: false,
    };
    try {
      setRouteLoading(true);
      squidClient.setConfig({
        baseUrl: 'https://api.0xsquid.com', // for mainnet use "https://api.0xsquid.com"
        integratorId: 'resolute-api',
      });
      await squidClient.init();

      const res = await squidClient.getRoute(params);

      // const res = await skipClient.route(
      //   isAmountIn
      //     ? {
      //         amountIn: amount.toString(),
      //         sourceAssetChainID: sourceChainID,
      //         sourceAssetDenom: sourceDenom,
      //         destAssetChainID: destChainID,
      //         destAssetDenom: destDenom,
      //         cumulativeAffiliateFeeBPS: '0',
      //         allowMultiTx: true,
      //         allowUnsafe: true,
      //         experimentalFeatures: ['cctp'],
      //       }
      //     : {
      //         amountOut: amount.toString(),
      //         sourceAssetChainID: sourceChainID,
      //         sourceAssetDenom: sourceDenom,
      //         destAssetChainID: destChainID,
      //         destAssetDenom: destDenom,
      //         cumulativeAffiliateFeeBPS: '0',
      //         allowMultiTx: true,
      //         allowUnsafe: true,
      //         experimentalFeatures: ['cctp'],
      //       }
      // );
      setRouteLoading(false);
      return {
        resAmount: res.route.estimate.toAmount,
        isAmountIn,
        route: res.route,
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.log('error occured while fetch route', error);
    } finally {
      setRouteLoading(false);
    }
    return {
      resAmount: 0,
      isAmountIn,
      route: null,
    };
  };
  return {
    getSwapRoute,
    routeLoading,
  };
};

export default useSwaps;
