import { createSkipRouterClient } from '@/store/features/ibc/ibcService';
import { Chain } from '@/types/swaps';
import React, { useEffect, useState } from 'react';

const useGetChains = () => {
  const skipClient = createSkipRouterClient();
  const [chainsInfo, setChainInfo] = useState<Chain[]>([]);

  useEffect(() => {
    (async () => {
      const chains = await skipClient.chains({ includeEVM: true });
      const chainsData = chains
        .map((chain): Chain => {
          return {
            ...chain,
            chainName: chain.chainName,
            prettyName: chain.chainName,
          };
        })
        .sort((chainA, chainB) => {
          return chainA.prettyName.localeCompare(chainB.prettyName);
        });
      setChainInfo(chainsData);
    })();
  }, []);
  return {
    chainsInfo,
  };
};

export default useGetChains;
