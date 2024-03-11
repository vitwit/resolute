import { createSkipRouterClient } from '@/store/features/swaps/swapsService';
import React, { useState } from 'react';

interface GetRouteInputs {
  sourceChainID: string;
  sourceDenom: string;
  destChainID: string;
  destDenom: string;
  amountIn: number;
}

const useSwaps = () => {
  const [routeLoading, setRouteLoading] = useState(false);
  const [amountOut, setAmountOut] = useState(0);
  const skipClient = createSkipRouterClient();
  const getSwapRoute = async ({
    amountIn,
    destChainID,
    destDenom,
    sourceChainID,
    sourceDenom,
  }: GetRouteInputs) => {
    try {
      setRouteLoading(true);
      const res = await skipClient.route({
        amountIn: amountIn.toString(),
        sourceAssetChainID: sourceChainID,
        sourceAssetDenom: sourceDenom,
        destAssetChainID: destChainID,
        destAssetDenom: destDenom,
        cumulativeAffiliateFeeBPS: '0',
        allowMultiTx: true,
        allowUnsafe: true,
        experimentalFeatures: ['cctp'],
      });
      setAmountOut(Number(res.amountOut));
      setRouteLoading(false);
      return {
        amountOut: Number(res.amountOut),
      };
    } catch (error) {
      console.log('error occured while fetch route', error);
    } finally {
      setRouteLoading(false);
    }
    return {
      amountOut: 0,
    };
  };
  return {
    getSwapRoute,
    routeLoading,
  };
};

export default useSwaps;
