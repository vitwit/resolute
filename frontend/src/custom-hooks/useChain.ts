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
  return {
    getChainEndpoints,
  };
};

export default useChain;
