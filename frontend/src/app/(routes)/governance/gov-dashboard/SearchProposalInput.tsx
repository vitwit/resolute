import { SEARCH_ICON } from '@/constants/image-names';
import { HandleInputChangeEvent } from '@/types/gov';
import Image from 'next/image';
import React from 'react';

const SearchProposalInput = ({
  searchQuery,
  handleSearchQueryChange,
  handleShowAllProposals,
}: {
  searchQuery: string;
  handleSearchQueryChange: HandleInputChangeEvent;
  handleShowAllProposals: HandleInputChangeEvent;
}) => {
  return (
    <div className="search-proposal-field">
      <div className="flex items-center gap-1 justify-between flex-1">
        <div className="flex items-center gap-2 flex-1">
          <Image src={SEARCH_ICON} height={24} width={24} alt="" />
          <input
            type="text"
            placeholder="Search Propoal by Name, ID, and Network"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="search-proposal-input flex-1"
            autoFocus={true}
          />
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <input
            className="cursor-pointer"
            type="checkbox"
            id="showAllProps"
            onChange={(e) => handleShowAllProposals(e)}
          />
          <label
            htmlFor="showAllProps"
            className="text-b1 text-[#FFFFFF80] cursor-pointer"
          >
            Show all proposals
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchProposalInput;
