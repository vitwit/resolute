import Image from 'next/image';
import React from 'react';

const SearchContracts = ({
  searchQuery,
  handleSearchQueryChange,
}: {
  searchQuery: string;
  handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="search-contract-field">
      <div className="flex gap-2 items-center flex-1">
        <Image src="/icons/search-icon.svg" height={24} width={24} alt="" />
        <input
          type="text"
          placeholder="Search Contracts"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="search-contract-input text-[14px]"
          autoFocus={true}
        />
      </div>
    </div>
  );
};

export default SearchContracts;
