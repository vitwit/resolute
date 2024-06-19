import React from 'react';
import Image from 'next/image';

const SearchValidator = ({
  searchQuery,
  handleSearchQueryChange,
}: {
  searchQuery: string;
  handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex gap-2 items-center search-bar">
      <Image src="/icons/search-icon.svg" height={24} width={24} alt="" />
      <input
        type="text"
        placeholder="Search Validator"
        value={searchQuery}
        onChange={handleSearchQueryChange}
        className="search-network-input"
      />
    </div>
  );
};

export default SearchValidator;
