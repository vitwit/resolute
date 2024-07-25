import { useAppSelector } from '@/custom-hooks/StateHooks';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ALERT_ICON,
  CHECK_ICON_FILLED,
  SWAP_ROUTE_ICON,
} from '@/constants/image-names';
import NetworkSelected from './swap-loading/NetworkSelected';
import NetworkName from './swap-loading/NetworkName';
import EmptyNetwork from './swap-loading/EmptyNetwork';
import EmptyNetworkName from './swap-loading/EmptyNetworkName';
import SwapSummary from './swap-loading/SwapSummary';
import { TxStatus } from '@/types/enums';

const IBCSwapLoading = ({
  toggleRoutePreview,
}: {
  toggleRoutePreview: () => void;
}) => {
  const selectedDestChain = useAppSelector((state) => state.swaps.destChain);
  const selectedSourceChain = useAppSelector(
    (state) => state.swaps.sourceChain
  );

  const [showTxSourceSuccess, setTxSourceSuccess] = useState(false);
  const [showTxDestSuccess, setTxDestSuccess] = useState(false);
  const txLoadRes = useAppSelector((state) => state.swaps.txStatus.status);
  const txHash = useAppSelector((state) => state.swaps.txSuccess.txHash);
  const txDestStatus = useAppSelector((state) => state.swaps.txDestSuccess);
  const selectedSourceAsset = useAppSelector(
    (state) => state.swaps.sourceAsset
  );
  const selectedDestAsset = useAppSelector((state) => state.swaps.destAsset);

  useEffect(() => {
    if (txHash?.length) {
      setTxSourceSuccess(true);
    } else {
      setTxSourceSuccess(false);
    }
  }, [txHash]);

  useEffect(() => {
    if (txDestStatus.status.length) {
      setTxDestSuccess(true);
    } else {
      setTxDestSuccess(false);
    }
  }, [txDestStatus]);

  return (
    <div className="px-10 space-y-10">
      <div className="space-y-5">
        <div className="flex items-center justify-between relative">
          {selectedSourceChain ? (
            <div
              className={`relative opacity-50 ${txLoadRes === TxStatus.PENDING && !showTxSourceSuccess ? 'custom-opacity-animation !opacity-100' : ''} ${showTxSourceSuccess ? '!opacity-100' : ''}`}
            >
              <NetworkSelected
                chainConfig={selectedSourceChain}
                isSource={true}
              />
              {selectedSourceAsset ? (
                <Image
                  className="absolute bottom-0 right-3 z-[99]"
                  src={selectedSourceAsset?.logoURI}
                  width={24}
                  height={24}
                  alt=""
                />
              ) : null}
            </div>
          ) : (
            <EmptyNetwork />
          )}
          <div
            className={`dotted-line relative opacity-50 ${txLoadRes === TxStatus.PENDING && !showTxSourceSuccess ? 'custom-scroll !opacity-100' : ''}  ${showTxSourceSuccess ? '!opacity-100' : ''}`}
          >
            {showTxSourceSuccess && (
              <img src={CHECK_ICON_FILLED} alt="Tick" className="tick-mark" />
            )}
          </div>
          <div className="flex flex-col items-center middle-div gap-2 mt-4">
            <Image
              onClick={toggleRoutePreview}
              className={`cursor-pointer ${txLoadRes === TxStatus.PENDING ? 'custom-spin' : ''}`}
              src={SWAP_ROUTE_ICON}
              width={60}
              height={60}
              alt=""
            />
            <div className="text-[12px] text-[#ffffff80]">Swap Route</div>
          </div>
          <div
            className={`dotted-line relative opacity-50 ${txLoadRes === TxStatus.PENDING && !showTxDestSuccess && showTxSourceSuccess ? 'custom-scroll !opacity-100' : ''} ${showTxDestSuccess ? '!opacity-100' : ''}`}
          >
            {showTxDestSuccess && (
              <img src={CHECK_ICON_FILLED} alt="Tick" className="tick-mark" />
            )}
          </div>
          {selectedDestChain ? (
            <div
              className={`opacity-50 ${txLoadRes === TxStatus.PENDING && !showTxDestSuccess && showTxSourceSuccess ? 'custom-opacity-animation' : '!opacity-100'}`}
            >
              <NetworkSelected
                chainConfig={selectedDestChain}
                isSource={false}
              />
              {selectedDestAsset ? (
                <Image
                  className="absolute bottom-0 right-3 z-[99]"
                  src={selectedDestAsset?.logoURI}
                  width={24}
                  height={24}
                  alt=""
                />
              ) : null}
            </div>
          ) : (
            <EmptyNetwork />
          )}
        </div>

        <div className="flex items-center justify-between">
          {selectedSourceChain ? (
            <NetworkName
              chainID={selectedSourceChain?.chainID}
              isSource={true}
            />
          ) : (
            <EmptyNetworkName isSource={true} />
          )}
          {selectedDestChain ? (
            <NetworkName
              chainID={selectedDestChain?.chainID}
              isSource={false}
            />
          ) : (
            <EmptyNetworkName isSource={false} />
          )}
        </div>
      </div>
      <div className="px-6 py-4 rounded-2xl bg-[#FFFFFF14] text-[14px] space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-[2px]">
            <Image src={ALERT_ICON} width={24} height={24} alt="" />
            <div className="text-[#FFC13C]">Important</div>
          </div>
          <div className="text-[#FFFFFFad]">IBC Swap</div>
        </div>
        <div className="flex gap-[26px]">
          <div></div>
          <SwapSummary />
        </div>
      </div>
    </div>
  );
};

export default IBCSwapLoading;
