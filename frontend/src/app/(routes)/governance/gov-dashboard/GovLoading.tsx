import React, { useEffect, useState } from 'react';
import SearchProposalInput from './SearchProposalInput';
import PageHeader from '@/components/common/PageHeader';

const GovLoading = () => {
  const [filterDays, setFilterDays] = useState(1);
  useEffect(() => {
    setFilterDays(0);
  }, []);
  return (
    <div className="gov-main">
      <div className="flex flex-col gap-10">
        {' '}
        <GovHeader />
        <div className="flex gap-20">
          <div className="flex py-2 gap-4">
            <button
              onClick={() => {}}
              className={`selected-btns text-base ${filterDays === 0 ? 'bg-[#ffffff14] border-none' : 'border-[#ffffff26]'}`}
            >
              All
            </button>
            <button
              onClick={() => {}}
              className={`selected-btns text-base ${filterDays === 2 ? 'bg-[#ffffff14] border-none' : 'border-[#ffffff26]'}`}
            >
              Voting ends in 2 days
            </button>
            <button
              onClick={() => {}}
              className={`selected-btns text-base ${filterDays === 1 ? 'bg-[#ffffff14] border-none' : 'border-[#ffffff26]'}`}
            >
              Voting ends in 1 day
            </button>
          </div>

          <div className="flex items-end flex-1">
            <SearchProposalInput
              searchQuery={''}
              handleSearchQueryChange={() => {}}
              handleShowAllProposals={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-6 py-0 pb-6 flex-1 overflow-y-scroll">
        {[1, 2, 3, 4].map((row, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="flex items-center gap-6">
              <div className="w-[64px] h-[35px] animate-pulse bg-[#252525] rounded"></div>
              <p className="w-[452px] h-[27px] animate-pulse bg-[#252525] rounded"></p>
              <p className="w-[85px] h-[27px] animate-pulse bg-[#252525] rounded-full"></p>
            </div>
            <div className="flex gap-6 w-full items-center">
              <p className="w-[180px] h-[21px] animate-pulse bg-[#252525] rounded"></p>
              <p className="w-[180px] h-[21px] animate-pulse bg-[#252525] rounded"></p>
              <div className="flex justify-end items-end w-full">
                <button className="w-20 h-10 animate-pulse bg-[#252525] rounded-full"></button>
              </div>
            </div>
            <div className="divider-line"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovLoading;

const GovHeader = () => {
  return (
    <PageHeader
      title="Governance"
      description="Connect your wallet now to access all the modules on resolute "
    />
  );
};
