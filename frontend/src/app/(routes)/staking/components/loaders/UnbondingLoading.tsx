import React from 'react';

const UnbondingLoading = () => {
  return (
    <div className="grid grid-cols-3 gap-10 px-6 py-0">
      {[1, 2, 3].map((_, index) => (
        <div
          key={index}
          className="w-[328px] h-[175px] animate-pulse bg-[#252525] rounded"
        />
      ))}
    </div>
  );
};

export default UnbondingLoading;
