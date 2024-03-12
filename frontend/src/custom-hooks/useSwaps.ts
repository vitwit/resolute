import { createSkipRouterClient } from '@/store/features/swaps/swapsService';
import React, { useState } from 'react';

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
  const skipClient = createSkipRouterClient();
  const getSwapRoute = async ({
    amount,
    destChainID,
    destDenom,
    sourceChainID,
    sourceDenom,
    isAmountIn,
  }: GetRouteInputs) => {
    try {
      setRouteLoading(true);
      const res = await skipClient.route(
        isAmountIn
          ? {
              amountIn: amount.toString(),
              sourceAssetChainID: sourceChainID,
              sourceAssetDenom: sourceDenom,
              destAssetChainID: destChainID,
              destAssetDenom: destDenom,
              cumulativeAffiliateFeeBPS: '0',
              allowMultiTx: true,
              allowUnsafe: true,
              experimentalFeatures: ['cctp'],
            }
          : {
              amountOut: amount.toString(),
              sourceAssetChainID: sourceChainID,
              sourceAssetDenom: sourceDenom,
              destAssetChainID: destChainID,
              destAssetDenom: destDenom,
              cumulativeAffiliateFeeBPS: '0',
              allowMultiTx: true,
              allowUnsafe: true,
              experimentalFeatures: ['cctp'],
            }
      );
      setRouteLoading(false);
      return {
        resAmount: isAmountIn ? Number(res.amountOut) : Number(res.amountIn),
        isAmountIn,
      };
    } catch (error) {
      console.log('error occured while fetch route', error);
    } finally {
      setRouteLoading(false);
    }
    return {
      resAmount: 0,
      isAmountIn,
    };
  };
  return {
    getSwapRoute,
    routeLoading,
  };
};

export default useSwaps;
