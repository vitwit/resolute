import { chains } from 'chain-registry';

const useChain = () => {
  const getChainEndpoints = (chainID: string) => {
    const filteredChain = chains.filter((chain) => chain.chain_id === chainID);
    const chainData = filteredChain[0];
    const apis: string[] = [];
    const rpcs: string[] = [];
    chainData?.apis?.rest?.slice(0, 3).forEach((api) => {
      apis.push(api.address);
    });
    chainData?.apis?.rpc?.slice(0, 3).forEach((rpc) => {
      rpcs.push(rpc.address);
    });
    return {
      apis,
      rpcs,
    };
  };

  const getExplorerEndpoints = (chainID: string) => {
    if (!chainID.length) {
      return {
        explorerEndpoint: '',
      };
    }
    const filteredChain = chains.filter((chain) => chain.chain_id === chainID);
    const chainData = filteredChain[0];
    console.log('here...', chainData);
    let explorerEndpoint = chainData.explorers?.[0].tx_page || '';
    chainData.explorers?.forEach((explorer) => {
      if (explorer.kind?.includes('mintscan'))
        explorerEndpoint = explorer.tx_page || '';
    });
    explorerEndpoint = explorerEndpoint ? explorerEndpoint.split('$')[0] : '';
    return {
      explorerEndpoint,
    };
  };

  return {
    getChainEndpoints,
    getExplorerEndpoints,
  };
};

export default useChain;
