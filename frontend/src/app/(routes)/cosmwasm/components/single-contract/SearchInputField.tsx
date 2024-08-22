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
    <div className="search-contract-field">
      <div>
        <Image
          src="/search-icon.svg"
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
