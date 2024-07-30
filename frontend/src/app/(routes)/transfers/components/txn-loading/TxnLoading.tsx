import React from 'react';
import { shortenAddress } from '@/utils/util';
import { GLOBE_ICON } from '@/constants/image-names';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
import StyledNetworkLogo from '../single-send/StyledNetworkLogo';

interface TxnLoadingProps {
  fromChainLogo: string;
  fromChainColor: string;
  fromAddress: string;
  toChainLogo: string;
  toChainColor: string;
  toAddress: string;
  msgsCount: number;
  isSingle: boolean;
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
    isSingle,
  } = props;
  const sendTxStatus = useAppSelector((state) => state.bank.tx.status);
  const ibcTxStatus = useAppSelector((state) => state.ibc.txStatus);

  const sendTxLoading =
    sendTxStatus === TxStatus.PENDING || ibcTxStatus === TxStatus.PENDING;

  return (
    <div className="w-full flex items-center justify-between relative">
      <div className="flex flex-col items-center gap-4 z-[99]">
        {fromChainLogo ? (
          <StyledNetworkLogo
            primaryColor={fromChainColor || '#4453DF'}
            logo={fromChainLogo || GLOBE_ICON}
          />
        ) : (
          <div className="opacity-60">
            <StyledNetworkLogo
              primaryColor={'#4453DF'}
              logo={GLOBE_ICON}
              rotate={true}
            />
          </div>
        )}
        <div className="bg-[#FFFFFF14] rounded-full flex items-center justify-center text-[14px] text-[#fffffff0] w-[150px] text-center h-8">
          {fromAddress ? (
            <span>{shortenAddress(fromAddress, 12)}</span>
          ) : (
            <span className="text-[#ffffff80]">From</span>
          )}
        </div>
      </div>
      {isSingle ? (
        <div
          className={`dotted-line custom-scroll send-loading ${sendTxLoading ? '' : 'invisible'}`}
        >
          <img
            src="/icons/right-arrow-icon.svg"
            alt="Tick"
            className="custom-opacity-animation"
          />
        </div>
      ) : (
        <div
          className={`multi-send-loading flex-1 ${sendTxLoading ? '' : 'invisible'}`}
        >
          <div className={`dotted-line custom-scroll`}>
            <div className="flex items-center gap-1">
              <img
                src="/icons/right-arrow-icon.svg"
                alt="Tick"
                className="custom-opacity-animation"
              />
              <img
                src="/icons/right-arrow-icon.svg"
                alt="Tick"
                className="custom-opacity-animation"
              />
              <img
                src="/icons/right-arrow-icon.svg"
                alt="Tick"
                className="custom-opacity-animation"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 z-[99]">
        {toChainLogo ? (
          <StyledNetworkLogo
            primaryColor={toChainColor || '#4453DF'}
            logo={toChainLogo || GLOBE_ICON}
          />
        ) : (
          <div className="opacity-60">
            <StyledNetworkLogo
              primaryColor={'#4453DF'}
              logo={GLOBE_ICON}
              rotate={true}
            />
          </div>
        )}
        <div className="bg-[#FFFFFF14] rounded-full flex items-center justify-center text-[14px] text-[#fffffff0] w-[150px] text-center h-8">
          {toAddress ? (
            <span>{shortenAddress(toAddress, 12)}</span>
          ) : (
            <span className="text-[#ffffff80]">To</span>
          )}
          {msgsCount > 1 ? (
            <span className="font-bold pl-1"> +{msgsCount - 1}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TxnLoading;
