import React, { useState } from 'react';
import GrantedByMe from './GrantedByMe';
import GrantedToMe from './GrantedToMe';


const FeegrantFilters = ({ chainIDs }: { chainIDs: string[] }) => {
  const [filter, setFilter] = useState('byMe');

  const handleFiltersChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  return (
    <div className="  w-full px-6">
      <div className="flex py-2 gap-2 w-full">
        <button
          onClick={() => handleFiltersChange('toMe')}
          className={`selected-filter text-[14px] ${
            filter === 'toMe'
              ? 'bg-[#ffffff14] border-transparent'
              : 'border-[#ffffff26]'
          }`}
        >
          Granted to me
        </button>
        <button
          onClick={() => handleFiltersChange('byMe')}
          className={`selected-filter text-[14px] ${
            filter === 'byMe'
              ? 'bg-[#ffffff14] border-transparent'
              : 'border-[#ffffff26]'
          }`}
        >
          Granted by me
        </button>
      </div>
      {filter === 'byMe' ? (
        <div className="">
          <GrantedByMe chainIDs={chainIDs} />
        </div>
      ) : null}
      {filter === 'toMe' ? (
        <div className="">
          <GrantedToMe />
        </div>
      ) : null}
    </div>
  );
};

export default FeegrantFilters;
