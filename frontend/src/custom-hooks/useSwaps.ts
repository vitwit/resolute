import { useState } from 'react';
import { Squid } from '@0xsquid/sdk';
import { GetRoute, RouteResponse } from '@0xsquid/sdk/dist/types';
import { SQUID_ID } from '@/utils/constants';

interface GetRouteInputs {
  sourceChainID: string;
  sourceDenom: string;
  destChainID: string;
  destDenom: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
}

const squidClient = new Squid();
squidClient.setConfig({
  baseUrl: 'https://api.0xsquid.com',
  integratorId: SQUID_ID,
});
squidClient.init();

const useSwaps = () => {
  const [routeLoading, setRouteLoading] = useState(false);

  const getSwapRoute = async ({
    amount,
    destChainID,
    destDenom,
    sourceChainID,
    sourceDenom,
    fromAddress,
    toAddress,
  }: GetRouteInputs) => {
    const params: GetRoute = {
      fromAddress: fromAddress,
      fromAmount: amount.toString(),
      fromChain: sourceChainID,
      fromToken: sourceDenom,
      toAddress: toAddress,
      toChain: destChainID,
      toToken: destDenom,
      slippage: 1,
      quoteOnly: false,
    };
    try {
      setRouteLoading(true);

      const res = await squidClient.getRoute(params);
      setRouteLoading(false);
      return {
        resAmount: res.route.estimate.toAmount,
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
      route: null,
    };
  };
  return {
    getSwapRoute,
    routeLoading,
  };
};

export default useSwaps;
