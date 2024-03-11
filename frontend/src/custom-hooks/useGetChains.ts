import { createSkipRouterClient } from '@/store/features/swaps/swapsService';
import React, { useEffect, useState } from 'react';

const useGetChains = () => {
  const skipClient = createSkipRouterClient();
  const [chainsInfo, setChainInfo] = useState<ChainConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChainsInfo = async () => {
    try {
      const chains = await skipClient.chains();
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
    } catch (error) {
      console.log('error while fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChainsInfo();
  }, []);
  return {
    loading,
    chainsInfo,
  };
};

export default useGetChains;
