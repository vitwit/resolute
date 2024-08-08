import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import React from 'react';
import CustomNetworkCard from './CustomNetworkCard';

const CustomNetworks = () => {
  const { getCustomNetworks, getChainInfo } = useGetChainInfo();
  const customNetworks = getCustomNetworks();

  return (
    <div className="grid grid-cols-3 gap-10 px-6">
      {customNetworks.map((chainID) => {
        const { chainLogo, chainName } = getChainInfo(chainID);
        return (
          <CustomNetworkCard
            key={chainID}
            chainID={chainID}
            chainName={chainName}
            chainLogo={chainLogo}
          />
        );
      })}
    </div>
  );
};

export default CustomNetworks;
