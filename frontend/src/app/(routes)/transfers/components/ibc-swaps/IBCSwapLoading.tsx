import { useAppSelector } from '@/custom-hooks/StateHooks';
import React from 'react';
import NetworkLogo from './NetworkLogo';
import Image from 'next/image';
import { SWAP_ROUTE_ICON } from '@/constants/image-names';
import { ChainConfig } from '@/types/swaps';
import useChain from '@/custom-hooks/useChain';
import { capitalizeFirstLetter, shortenName } from '@/utils/util';
import { Tooltip } from '@mui/material';

const IBCSwapLoading = () => {
  const selectedDestChain = useAppSelector((state) => state.swaps.destChain);
  const selectedSourceChain = useAppSelector(
    (state) => state.swaps.sourceChain
  );
  return (
    <div className="flex items-center justify-between px-10">
      {selectedSourceChain ? (
        <NetworkSelected chainConfig={selectedSourceChain} isSource={true} />
      ) : null}
      <div className="flex flex-col items-center">
        <Image src={SWAP_ROUTE_ICON} width={80} height={80} alt="" />
        <div className="text-[12px] text-[#ffffff80]">Swap Route</div>
      </div>
      {selectedDestChain ? (
        <NetworkSelected chainConfig={selectedDestChain} isSource={false} />
      ) : null}
    </div>
  );
};

export default IBCSwapLoading;

const NetworkSelected = ({
  chainConfig,
  isSource,
}: {
  chainConfig: ChainConfig;
  isSource: boolean;
}) => {
  const { getChainNameFromID } = useChain();
  const { chainName } = getChainNameFromID(chainConfig.chainID);
  const networkName =
    shortenName(chainName, 9) || (isSource ? 'Source' : 'Destination');
  return (
    <div className="flex flex-col items-center gap-6">
      <NetworkLogo
        logo={chainConfig?.logoURI || (isSource ? 'Source' : 'Destination')}
        chainID={chainConfig?.chainID}
      />
      <Tooltip title={capitalizeFirstLetter(chainName)} placement="bottom">
        <div className="bg-[#FFFFFF14] w-[120px] rounded-full py-2 px-4 text-[#ffffffad] text-center capitalize">
          {networkName}
        </div>
      </Tooltip>
    </div>
  );
};
