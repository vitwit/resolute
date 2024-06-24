import { SEARCH_ICON } from '@/constants/image-names';
import { HandleInputChangeEvent } from '@/types/gov';
import Image from 'next/image';
import React, { useState } from 'react';

const SearchProposalInput = ({
  searchQuery,
  handleSearchQueryChange,
  handleShowAllProposals,
}: {
  searchQuery: string;
  handleSearchQueryChange: HandleInputChangeEvent;
  handleShowAllProposals: (arg: boolean)=> void;
}) => {
  const [check, SetCheck] = useState(false);
  return (
    <div className="search-proposal-field">
      <div className="flex items-center gap-1 justify-between flex-1">
        <div className="flex items-center gap-2 flex-1">
          <Image src={SEARCH_ICON} height={24} width={24} alt="" />
          <input
            type="text"
            placeholder="Search Proposal by Name, ID, and Network"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="search-proposal-input flex-1 text-[14px]"
            autoFocus={true}
          />
        </div>
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            handleShowAllProposals(!check)
            SetCheck(!check);
          }}
        >
          {check ? (
            <Image
              src="/after-check.svg"
              width={20}
              height={20}
              alt="after-check-icon"
            />
          ) : (
            <Image
              src="/before-check.svg"
              width={20}
              height={20}
              alt="before-check-icon"
            />
          )}

          <label
            htmlFor="showAllProps"
            className="text-[14px] text-[#FFFFFF50] cursor-pointer"
          >
            Show deposit proposals
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchProposalInput;
