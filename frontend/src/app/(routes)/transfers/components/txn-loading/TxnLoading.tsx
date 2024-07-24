import React from 'react';
import StyledNetworkLogo from './StyledNetworkLogo';
import { shortenAddress } from '@/utils/util';
import { GLOBE_ICON, ROCKET_LAUNCH_GIF } from '@/constants/image-names';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';

interface TxnLoadingProps {
  fromChainLogo: string;
  fromChainColor: string;
  fromAddress: string;
  toChainLogo: string;
  toChainColor: string;
  toAddress: string;
  msgsCount: number;
}

const TxnLoading = (props: TxnLoadingProps) => {
  const {
    fromChainLogo,
    fromChainColor,
    fromAddress,
    toChainLogo,
    toChainColor,
    toAddress,
    msgsCount,
  } = props;
  const sendTxStatus = useAppSelector((state) => state.bank.tx.status);
  const ibcTxStatus = useAppSelector((state) => state.ibc.txStatus);

  const sendTxLoading =
    sendTxStatus === TxStatus.PENDING || ibcTxStatus === TxStatus.PENDING;

  return (
    <div className="w-full flex items-center justify-between relative">
      <div className="flex flex-col items-center gap-4 z-[99]">
        <StyledNetworkLogo
          color={fromChainColor || '#4453DF'}
          logo={fromChainLogo || GLOBE_ICON}
        />
        <div className="bg-[#FFFFFF14] rounded-full px-4 py-2 text-[14px] text-[#ffffffad] w-[186px] text-center">
          {fromAddress ? (
            <span>{shortenAddress(fromAddress, 15)}</span>
          ) : (
            <span className="text-[#ffffff80]">From</span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 z-[99]">
        <StyledNetworkLogo
          color={toChainColor || '#4453DF'}
          logo={toChainLogo || GLOBE_ICON}
        />
        <div className="bg-[#FFFFFF14] rounded-full px-4 py-2 text-[14px] text-[#ffffffad] w-[186px] text-center">
          {toAddress ? (
            <span>{shortenAddress(toAddress, 15)}</span>
          ) : (
            <span className="text-[#ffffff80]">To</span>
          )}
          {msgsCount > 1 ? (
            <span className="font-bold pl-1"> +{msgsCount - 1}</span>
          ) : null}
        </div>
      </div>
      <div className="absolute left-[20%] bottom-[-1.5%]">
        <img
          className={`rotate-90 w-full ${sendTxLoading ? '' : 'invisible'}`}
          src={ROCKET_LAUNCH_GIF}
          alt="Rocket Launch"
        />
      </div>
    </div>
  );
};

export default TxnLoading;
