import { SEARCH_ICON } from '@/constants/image-names';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import React, { useState } from 'react';

interface SelectNetworksProps {
  selectedNetworks: string[];
  handleSelectChain: (chainName: string) => void;
}

const SelectNetworks = (props: SelectNetworksProps) => {
  const { selectedNetworks, handleSelectChain } = props;

  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const chainNames = Object.keys(nameToChainIDs);
  const [displayedChains, setDisplayedChains] = useState<string[]>(
    chainNames?.slice(0, 5) || []
  );
  const [viewAllChains, setViewAllChains] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChains, setFilteredChains] = useState<string[]>([]);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    const filtered = chainNames.filter((chain) =>
      chain.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredChains(filtered);
    setSearchQuery(query);
  };

  const handleViewAllChains = (value: boolean) => {
    if (value) {
      setDisplayedChains(filteredChains);
    } else {
      setDisplayedChains(filteredChains?.slice(0, 5) || []);
    }
    setViewAllChains(value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-[#ffffff80] text-[14px]">Select Networks</div>
        <SearchNetworkInput
          searchQuery={searchQuery}
          handleSearchQueryChange={handleSearchQueryChange}
          resetInput={() => setSearchQuery('')}
        />
      </div>
      <NetworksList
        networks={searchQuery?.length ? filteredChains : displayedChains}
        selectedNetworks={selectedNetworks}
        handleSelectChain={handleSelectChain}
      />
      <button
        onClick={() => handleViewAllChains(!viewAllChains)}
        className={`secondary-btn mx-auto flex ${searchQuery?.length ? 'invisible' : ''}`}
        type="button"
      >
        {viewAllChains ? 'View Less' : 'View All'}
      </button>
    </div>
  );
};

export default SelectNetworks;

const SearchNetworkInput = ({
  searchQuery,
  handleSearchQueryChange,
  resetInput,
}: {
  searchQuery: string;
  handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetInput: () => void;
}) => {
  return (
    <div className="h-10 bg-[#FFFFFF05] rounded-full px-6 py-4 flex items-center gap-4">
      <Image src={SEARCH_ICON} height={16} width={16} alt="" />
      <input
        type="text"
        placeholder="Search Network"
        value={searchQuery}
        onChange={handleSearchQueryChange}
        className="search-network-input"
        autoFocus={true}
      />
      {searchQuery?.length > 0 && (
        <button
          onClick={resetInput}
          className="hover:bg-[#ffffff3c] rounded-full"
          type="button"
        >
          <Image
            className="opacity-70"
            onClick={resetInput}
            src="/close.svg"
            width={16}
            height={16}
            alt=""
          />
        </button>
      )}
    </div>
  );
};

const NetworkItem = ({
  chainLogo,
  chainName,
  selected,
  handleSelectChain,
}: {
  chainName: string;
  chainLogo: string;
  selected: boolean;
  handleSelectChain: () => void;
}) => {
  return (
    <button
      className={`chain-item ${selected ? 'chain-item-selected' : ''}`}
      type="button"
      onClick={handleSelectChain}
    >
      <Image
        className="p-1 rounded-full"
        src={chainLogo}
        width={24}
        height={24}
        alt=""
      />
      <div className="capitalize text-b1">{chainName}</div>
    </button>
  );
};

const NetworksList = ({
  networks,
  selectedNetworks,
  handleSelectChain,
}: {
  networks: string[];
  selectedNetworks: string[];
  handleSelectChain: (chainName: string) => void;
}) => {
  const { getChainInfo } = useGetChainInfo();
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);

  return (
    <div className="min-h-[100px]">
      {networks?.length ? (
        <div className="flex flex-wrap gap-4">
          {networks.map((network) => {
            const chainID = nameToChainIDs?.[network];
            const { chainName, chainLogo } = getChainInfo(chainID);
            return chainName ? (
              <NetworkItem
                key={chainID}
                chainName={chainName}
                chainLogo={chainLogo}
                selected={selectedNetworks.includes(chainName.toLowerCase())}
                handleSelectChain={() => handleSelectChain(chainName)}
              />
            ) : null;
          })}
        </div>
      ) : (
        <div className="w-full h-[100px] flex items-center justify-center">
          <div className="secondary-text">Network not found</div>
        </div>
      )}
    </div>
  );
};
