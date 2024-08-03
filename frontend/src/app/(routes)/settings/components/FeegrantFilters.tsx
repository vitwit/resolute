import React, { useState } from 'react';
import FeegrantsByMe from '../components/FeegrantsByMe';
import FeegrantsToMe from '../components/FeegrantsToMe';

const FeegrantFilters = (
  {
    //   handleFiltersChange,
    //   filter,
  }
  // : {
  //   handleFiltersChange: (filter: string) => void;
  //   filter: string;
  // }
) => {
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
          Feegrant to me
        </button>
        <button
          onClick={() => handleFiltersChange('byMe')}
          className={`selected-filter text-[14px] ${
            filter === 'byMe'
              ? 'bg-[#ffffff14] border-transparent'
              : 'border-[#ffffff26]'
          }`}
        >
          Feegrant by me
        </button>
      </div>
      {filter === 'byMe' ? (
        <div className="">
          <FeegrantsByMe />
        </div>
      ) : null}
      {filter === 'toMe' ? (
        <div className="">
          <FeegrantsToMe />
        </div>
      ) : null}
    </div>
  );
};

export default FeegrantFilters;
