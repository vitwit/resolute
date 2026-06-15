import React from 'react';

const ContractsLoading = () => {
  return (
    <div className="px-6 flex flex-col gap-4 py-6">
      {[1, 2, 3, 4].map((_, index) => (
        <div key={index} className="flex justify-between">
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full animate-pulse bg-[#252525]" />
            <div className="w-[450px] h-5 rounded bg-[#252525]"></div>
          </div>
          <div className="flex gap-6">
            <div className="w-[85px] h-8 rounded-full bg-[#252525]"></div>
            <div className="w-[85px] h-8 rounded-full bg-[#252525]"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContractsLoading;
