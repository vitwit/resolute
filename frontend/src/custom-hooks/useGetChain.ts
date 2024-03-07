import { createSkipRouterClient } from '@/store/features/swaps/swapsService';
import React, { useEffect, useState } from 'react';

const useGetChains = () => {
  const skipClient = createSkipRouterClient();
  const [chainsInfo, setChainInfo] = useState<ChainConfig[]>([]);

  useEffect(() => {
    (async () => {
      const chains = await skipClient.chains({ includeEVM: true });
      const chainsData = chains
        .map((chain): ChainConfig => {
          return {
            label: chain.chainName,
            logoURI: chain.logoURI || '',
            chainID: chain.chainID,
          };
        })
        .sort((chainA, chainB) => {
          return chainA.label.localeCompare(chainB.label);
        });
      setChainInfo(chainsData);
    })();
  }, []);
  return {
    chainsInfo,
  };
};

export default useGetChains;
