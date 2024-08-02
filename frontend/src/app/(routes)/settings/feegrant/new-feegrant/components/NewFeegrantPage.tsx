import React, { useState } from 'react';
import SelectNetworks from '../../../components/NetworksList';

const NewFeegrantPage = () => {
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const handleSelectChain = (chainName: string) => {
    // if (txnStarted) {
    //   return;
    // }
    const updatedSelection = selectedChains.includes(chainName)
      ? selectedChains.filter((id) => id !== chainName)
      : [...selectedChains, chainName];
    setSelectedChains(updatedSelection);
  };

  return (
    <div className="flex h-full overflow-y-scroll mt-10">
      <div className="max-h-full overflow-y-scroll w-[40%]">
        <SelectNetworks
          selectedNetworks={selectedChains}
          handleSelectChain={handleSelectChain}
        />
      </div>
      <div className="w-[60%]"></div>
    </div>
  );
};

export default NewFeegrantPage;
