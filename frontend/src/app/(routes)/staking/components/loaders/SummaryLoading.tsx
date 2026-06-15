import React from 'react';

const SummaryLoading = () => {
  return (
    <div className="flex gap-6 w-full px-6 py-0">
      <div className="grid grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className="w-[254px] animate-pulse h-[128px] bg-[#252525] rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default SummaryLoading;
