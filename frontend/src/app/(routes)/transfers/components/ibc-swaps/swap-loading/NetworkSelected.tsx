import { ChainConfig } from '@/types/swaps';
import React from 'react'
import NetworkLogo from '../NetworkLogo';

const NetworkSelected = ({
    chainConfig,
    isSource,
  }: {
    chainConfig: ChainConfig;
    isSource: boolean;
  }) => {
    return (
      <div className="flex flex-col items-center gap-6 w-[120px]">
        <NetworkLogo
          logo={chainConfig?.logoURI || (isSource ? 'Source' : 'Destination')}
          chainID={chainConfig?.chainID}
        />
      </div>
    );
  };
export default NetworkSelected