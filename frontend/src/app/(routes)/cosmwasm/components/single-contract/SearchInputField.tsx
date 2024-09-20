import { SEARCH_ICON } from '@/constants/image-names';
import Image from 'next/image';
import React from 'react';

const SearchInputField = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}) => {
  return (
    <div className="search-contract-field gap-2">
      <div>
        <Image
          src={SEARCH_ICON}
          width={24}
          height={24}
          alt="Search"
          draggable={false}
        />
      </div>
      <div className="w-full">
        <input
          className="search-contract-input"
          type="text"
          placeholder="Search Contract"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus={true}
        />
      </div>
    </div>
  );
};

export default SearchInputField;
