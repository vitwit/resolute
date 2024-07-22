import React from 'react';
import StyledNetworkLogo from './StyledNetworkLogo';
import { shortenAddress } from '@/utils/util';
import Image from 'next/image';
import { ROCKET_LAUNCH_GIF } from '@/constants/image-names';

interface TxnLoadingProps {
  fromChainLogo: string;
  fromChainColor: string;
  fromAddress: string;
  toChainLogo: string;
  toChainColor: string;
  toAddress: string;
}

const TxnLoading = (props: TxnLoadingProps) => {
  const {
    fromChainLogo,
    fromChainColor,
    fromAddress,
    toChainLogo,
    toChainColor,
    toAddress,
  } = props;
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex flex-col items-center z-[99]">
        <StyledNetworkLogo color={fromChainColor} logo={fromChainLogo} />
        <div className="bg-[#FFFFFF14] rounded-full px-10 py-2 text-[14px] text-[#ffffffad]">
          {shortenAddress(fromAddress, 15)}
        </div>
      </div>
      <div
        className="flex justify-center"
        style={{ transform: 'translate(-80px, -20px)' }}
      >
        <img className="rotate-90" src={ROCKET_LAUNCH_GIF} />
      </div>
      <div className="flex flex-col items-center">
        <StyledNetworkLogo color={toChainColor} logo={toChainLogo} />
        <div className="bg-[#FFFFFF14] rounded-full px-10 py-2 text-[14px] text-[#ffffffad]">
          {shortenAddress(toAddress, 15)}
        </div>
      </div>
    </div>
  );
};

export default TxnLoading;
