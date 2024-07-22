import React from 'react';
import StyledNetworkLogo from './StyledNetworkLogo';
import { shortenAddress } from '@/utils/util';
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
    <div className="w-full flex items-center justify-between scale-[0.8] max:scale-[1]">
      <div className="flex flex-col items-center gap-4 z-[99]">
        <StyledNetworkLogo color={fromChainColor} logo={fromChainLogo} />
        <div className="bg-[#FFFFFF14] rounded-full px-10 py-2 text-[14px] text-[#ffffffad]">
          {shortenAddress(fromAddress, 15)}
        </div>
      </div>
      <img
        className="rotate-90 translate-x-[-95px] translate-y-[-20px] w-full"
        src={ROCKET_LAUNCH_GIF}
        alt="Rocket Launch"
      />
      <div className="flex flex-col items-center gap-4 z-[99]">
        <StyledNetworkLogo color={toChainColor} logo={toChainLogo} />
        <div className="bg-[#FFFFFF14] rounded-full px-10 py-2 text-[14px] text-[#ffffffad]">
          {shortenAddress(toAddress, 15)}
        </div>
      </div>
    </div>
  );
};

export default TxnLoading;
