import { useState } from 'react';
import { Squid } from '@0xsquid/sdk';
import {
  CosmosTransferAction,
  GetRoute,
  RouteData,
  Swap,
} from '@0xsquid/sdk/dist/types';
import { SQUID_ID, SWAP_ROUTE_ERROR } from '@/utils/constants';
import useChain from './useChain';
import { useAppSelector } from './StateHooks';
import { SwapPathObject } from '@/types/swaps';
import useGetChains from './useGetChains';

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
  const [routeError, setRouteError] = useState('');
  const { getChainNameFromID } = useChain();
  const { getChainLogoURI } = useGetChains();
  const fromAmount = useAppSelector((state) => state.swaps.amountIn);
  const toAmount = useAppSelector((state) => state.swaps.amountOut);
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
      setRouteError('');
      const res = await squidClient.getRoute(params);
      setRouteLoading(false);
      return {
        resAmount: res.route.estimate.toAmount,
        route: res.route,
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      if (error?.code === 'ERR_NETWORK') {
        console.log(error.message);
        setRouteError(error?.message || SWAP_ROUTE_ERROR);
      } else {
        const errMsg =
          error?.response?.data?.errors?.[0]?.message || SWAP_ROUTE_ERROR;
        console.log('error occured while fetch route', errMsg);
        setRouteError(errMsg || SWAP_ROUTE_ERROR);
      }
    } finally {
      setRouteLoading(false);
    }
    return {
      resAmount: 0,
      route: null,
    };
  };

  const getSwapPathData = (swapRoute: RouteData) => {
    const pathData: SwapPathObject[] = [];
    const fromTokenData = swapRoute.params.fromToken;
    const toTokenData = swapRoute.params.toToken;
    const fromTokenLogo = fromTokenData.logoURI;
    const toTokenLogo = toTokenData.logoURI;
    const fromChainId = fromTokenData.chainId;
    const toChainId = toTokenData.chainId;
    const fromTokenSymbol = fromTokenData.symbol;
    const toTokenSymbol = toTokenData.symbol;
    const { chainName: fromChainName } = getChainNameFromID(
      fromChainId.toString()
    );
    const { chainName: toChainName } = getChainNameFromID(toChainId.toString());
    const fromChainRoute = swapRoute.estimate.route.fromChain;
    fromChainRoute.forEach((route) => {
      if (route.type === 'Swap') {
        const routePath = route as Swap;
        const pathObject: SwapPathObject = {
          type: 'swap',
          value: {
            dex: routePath.dex,
            fromToken: {
              symbol: routePath.fromToken.symbol,
              logo: routePath.fromToken.logoURI,
            },
            toToken: {
              symbol: routePath.toToken.symbol,
              logo: routePath.toToken.logoURI,
            },
          },
        };
        pathData.push(pathObject);
      } else if (route.type === 'Transfer') {
        const routePath = route as CosmosTransferAction;
        const { chainName: fromChainName } = getChainNameFromID(
          routePath.fromChain
        );
        const { chainName: toChainName } = getChainNameFromID(
          routePath.toChain
        );
        const fromChainLogo = getChainLogoURI(
          routePath.fromToken.chainId.toString()
        );
        const toChainLogo = getChainLogoURI(
          routePath.toToken.chainId.toString()
        );
        const pathObject: SwapPathObject = {
          type: 'transfer',
          value: {
            fromChainName,
            toChainName,
            tokenLogo: routePath.fromToken.logoURI || routePath.toToken.logoURI,
            fromChainLogo,
            toChainLogo,
            tokenSymbol: routePath.fromToken.symbol || routePath.toToken.symbol,
          },
        };
        pathData.push(pathObject);
      }
    });
    return {
      fromChainData: {
        tokenLogo: fromTokenLogo,
        amount: fromAmount,
        tokenSymbol: fromTokenSymbol,
        chainName: fromChainName,
      },
      toChainData: {
        tokenLogo: toTokenLogo,
        amount: toAmount,
        tokenSymbol: toTokenSymbol,
        chainName: toChainName,
      },
      pathData,
    };
  };

  return {
    getSwapRoute,
    getSwapPathData,
    routeLoading,
    routeError,
  };
};

export default useSwaps;
