import useSwaps from '@/custom-hooks/useSwaps';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import { RouteData } from '@0xsquid/sdk';
import Image from 'next/image';
import React from 'react';
import TransferPath from './route-preview/TransferPath';
import SwapPath from './route-preview/SwapPath';
import ChainToken from './route-preview/ChainToken';

const RoutePreview = ({
  swapRoute,
  onClose,
}: {
  swapRoute: RouteData;
  onClose: () => void;
}) => {
  const { getSwapPathData } = useSwaps();
  const { fromChainData, toChainData, pathData } = getSwapPathData(swapRoute);
  return (
    <div className="absolute bottom-0 h-full dialog-box-bg rounded-2xl p-6 w-full">
      <div className="space-y-6">
        <div className="flex gap-2 items-center justify-between">
          <div className="font-bold">Route Preview</div>
          <Image
            className="cursor-pointer"
            src={CLOSE_ICON_PATH}
            width={24}
            height={24}
            alt="Close"
            draggable={false}
            onClick={() => onClose()}
          />
        </div>
        <div className="bg-[#FFFFFF0D] p-6 min-h-48 w-full rounded-2xl border-[0.5px] border-[#ffffff23]">
          <div className="flex flex-col gap-6">
            <ChainToken
              amount={fromChainData.amount}
              chainName={fromChainData.chainName}
              logo={fromChainData.tokenLogo}
              symbol={fromChainData.tokenSymbol}
            />
            <div className="flex items-center">
              <div className="flex-1 flex-center-center animate-bounce">
                <Image
                  src="/down-arrow-icon.svg"
                  width={32}
                  height={32}
                  alt=""
                />
              </div>
              <div className="w-[85%] min-h-12 flex flex-col gap-4">
                {pathData.map((path, index) => {
                  return (
                    <React.Fragment key={index}>
                      {path.type === 'swap' ? (
                        <SwapPath
                          dex={path.value.dex}
                          fromLogo={path.value.fromToken.logo}
                          fromSymbol={path.value.fromToken.symbol}
                          toLogo={path.value.toToken.logo}
                          toSymbol={path.value.toToken.symbol}
                        />
                      ) : (
                        <TransferPath
                          fromLogo={path.value.fromChainLogo}
                          fromName={path.value.fromChainName}
                          toLogo={path.value.toChainLogo}
                          toName={path.value.toChainName}
                          tokenLogo={path.value.toChainLogo}
                          tokenSymbol={path.value.tokenSymbol}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <ChainToken
              amount={toChainData.amount}
              chainName={toChainData.chainName}
              logo={toChainData.tokenLogo}
              symbol={toChainData.tokenSymbol}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePreview;
