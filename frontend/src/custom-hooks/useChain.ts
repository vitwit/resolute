import React from 'react';
import { chains } from 'chain-registry';

const useChain = () => {
  const getChainAPIs = (chainID: string) => {
    const filteredChain = chains.filter((chain) => chain.chain_id === chainID);
    const chainData = filteredChain[0];
    let apis: string[] = [];
    chainData?.apis?.rest?.slice(0, 3).forEach((api) => {
      apis.push(api.address);
    });
    return {
      apis,
    };
  };
  return {
    getChainAPIs,
  };
};

export default useChain;
