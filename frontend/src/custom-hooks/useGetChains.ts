import { createSkipRouterClient } from '@/store/features/swaps/swapsService';
import { ChainConfig } from '@/types/swaps';
import { SQUID_ID } from '@/utils/constants';
import axios from 'axios';
import { useEffect, useState } from 'react';

const useGetChains = () => {
  const skipClient = createSkipRouterClient();
  const [chainsInfo, setChainInfo] = useState<ChainConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChainsInfo = async () => {
    try {
      // const chains = await skipClient.chains();
      const result = await axios.get(
        'https://v2.api.squidrouter.com/v2/chains',
        {
          headers: {
            'x-integrator-id': SQUID_ID,
          },
        }
      );
      const chains: ChainData[] = result.data.chains;
      const chainsData = chains
        .map((chain): ChainConfig => {
          return {
            label: chain.axelarChainName,
            logoURI: chain.chainIconURI || '',
            chainID: chain.chainId,
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
