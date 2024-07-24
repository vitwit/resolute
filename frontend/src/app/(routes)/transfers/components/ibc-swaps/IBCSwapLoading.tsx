import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';
import NetworkLogo from './NetworkLogo';
import Image from 'next/image';
import {
  ALERT_ICON,
  CHECK_ICON_FILLED,
  GLOBE_ICON,
  SWAP_ROUTE_ICON,
} from '@/constants/image-names';
import { ChainConfig } from '@/types/swaps';
import useChain from '@/custom-hooks/useChain';
import { capitalizeFirstLetter, shortenName } from '@/utils/util';
import { Tooltip } from '@mui/material';
import NetworkSelected from './swap-loading/NetworkSelected';
import NetworkName from './swap-loading/NetworkName';
import EmptyNetwork from './swap-loading/EmptyNetwork';
import EmptyNetworkName from './swap-loading/EmptyNetworkName';
import SwapSummary from './swap-loading/SwapSummary';

const IBCSwapLoading = () => {
  const selectedDestChain = useAppSelector((state) => state.swaps.destChain);
  const selectedSourceChain = useAppSelector(
    (state) => state.swaps.sourceChain
  );

  return (
    <div className="px-10 space-y-10">
      <div className="space-y-7">
        <div className="flex items-center justify-between relative">
          {selectedSourceChain ? (
            <NetworkSelected
              chainConfig={selectedSourceChain}
              isSource={true}
            />
          ) : (
            <EmptyNetwork />
          )}
          {selectedSourceChain && (
            <div className="dotted-line relative">
              {true && (
                <img src={CHECK_ICON_FILLED} alt="Tick" className="tick-mark" />
              )}
            </div>
          )}
          <div className="flex flex-col items-center middle-div">
            <Image
              className="custom-spin"
              src={SWAP_ROUTE_ICON}
              width={80}
              height={80}
              alt=""
            />
            <div className="text-[12px] text-[#ffffff80]">Swap Route</div>
          </div>
          {selectedDestChain && (
            <div className="dotted-line relative">
              {true && (
                <img src={CHECK_ICON_FILLED} alt="Tick" className="tick-mark" />
              )}
            </div>
          )}
          {selectedDestChain ? (
            <NetworkSelected chainConfig={selectedDestChain} isSource={false} />
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
          <div className="flex items-center">
            <Image src={ALERT_ICON} width={24} height={24} alt="" />
            <div className="text-[#FFC13C]">Important</div>
          </div>
          <div className="text-[#FFFFFF80]">
            Transaction pending<span className="dots-flashing"></span>
          </div>
        </div>
        <SwapSummary />
      </div>
    </div>
  );
};

export default IBCSwapLoading;
