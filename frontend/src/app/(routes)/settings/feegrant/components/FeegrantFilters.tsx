import React from 'react';

const FeegrantFilters = ({
  handleFilterChange,
  isGrantsToMe,
}: {
  isGrantsToMe: boolean;
  handleFilterChange: (value: boolean) => void;
}) => {
  return (
    <div className="flex py-2 gap-2 w-full">
      <button
        onClick={() => handleFilterChange(true)}
        className={`selected-filter text-[14px] ${
          isGrantsToMe
            ? 'bg-[#ffffff14] border-transparent'
            : 'border-[#ffffff26]'
        }`}
      >
        Feegrant to me
      </button>
      <button
        onClick={() => handleFilterChange(false)}
        className={`selected-filter text-[14px] ${
          !isGrantsToMe
            ? 'bg-[#ffffff14] border-transparent'
            : 'border-[#ffffff26]'
        }`}
      >
        Feegrant by me
      </button>
    </div>
  );
};

export default FeegrantFilters;
