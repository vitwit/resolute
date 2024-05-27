import Image from 'next/image';
import React from 'react';

const SearchNetworkInput = ({
  searchQuery,
  handleSearchQueryChange,
}: {
  searchQuery: string;
  handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex gap-2 items-center flex-1">
      <Image src="/icons/search-icon.svg" height={24} width={24} alt="" />
      <input
        type="text"
        placeholder="Search Network"
        value={searchQuery}
        onChange={handleSearchQueryChange}
        className="search-network-input"
        autoFocus={true}
      />
    </div>
  );
};

export default SearchNetworkInput;
