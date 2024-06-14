import useSwaps from '@/custom-hooks/useSwaps';
import { RouteData } from '@0xsquid/sdk';
import Image from 'next/image';
import React from 'react';
import TransferPath from './route-preview/TransferPath';
import SwapPath from './route-preview/SwapPath';
import ChainToken from './route-preview/ChainToken';
import CustomButton from '@/components/common/CustomButton';

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
    <div className="flex flex-col gap-4 w-full h-[700px] rounded-2xl">
      <div className="flex items-center justify-between w-full">
        <div className="text-b1 text-[#ffffff80]">Route Preview</div>
        <button onClick={onClose} className="secondary-btn">
          close
        </button>
      </div>
      <div className="bg-[#ffffff06] flex-1 p-6 h-full w-full rounded-2xl border-[1px] border-[#ffffff13]">
        <div className="flex flex-col gap-6">
          <ChainToken
            amount={fromChainData.amount}
            chainName={fromChainData.chainName}
            logo={fromChainData.tokenLogo}
            symbol={fromChainData.tokenSymbol}
          />
          <div className="flex items-center">
            <div className="flex-1 flex-center-center animate-bounce">
              <Image src="/down-arrow-icon.svg" width={32} height={32} alt="" />
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
                        tokenLogo={path.value.tokenLogo}
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
      <CustomButton btnText="Close Preview" btnOnClick={onClose} />
    </div>
  );
};

export default RoutePreview;
