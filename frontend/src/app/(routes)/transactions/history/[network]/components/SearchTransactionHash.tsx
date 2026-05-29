import Image from 'next/image';
import React from 'react';

const SearchTransactionHash = ({
  searchQuery,
  handleSearchQueryChange,
  handleClearSearch,
}: {
  searchQuery: string;
  handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch?: () => void;
}) => {
  return (
    <div className="search-Txn-field">
      <div className="flex gap-2 items-center flex-1">
        <Image src="/icons/search-icon.svg" height={24} width={24} alt="" />
        <div className="flex gap-2 items-center flex-1">
          <input
            type="text"
            placeholder="Search by Transaction Hash...."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="search-Txn-input text-[14px] flex-1"
            autoFocus={true}
          />
          {searchQuery && handleClearSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-white opacity-50"
            >
              &#x2715;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchTransactionHash;
