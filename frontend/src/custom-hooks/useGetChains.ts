import { ChainConfig } from '@/types/swaps';
import { SQUID_ID } from '@/utils/constants';
import axios from 'axios';
import { useEffect, useState } from 'react';

const useGetChains = () => {
  const [chainsInfo, setChainInfo] = useState<ChainConfig[]>([]);
  const [chainsData, setChainsData] = useState<ChainData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChainsInfo();
  }, []);

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
      setChainsData(chains);
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

  const getChainConfig = (chainID: string) => {
    const chainConfig = chainsData.filter((chain) => chain.chainId === chainID);
    return chainConfig[0];
  };

  const getChainLogoURI = (chainID: string) => {
    const chainConfig = getChainConfig(chainID);
    const logoURI = chainConfig?.chainIconURI || '';
    return logoURI;
  };

  return {
    loading,
    chainsInfo,
    getChainConfig,
    getChainLogoURI,
  };
};

export default useGetChains;
