import React from 'react';

const CodesLoading = () => {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4].map((_, index) => (
        <div key={index} className="contract-card">
          <div className="flex flex-col gap-2 w-[10%]">
            <p className="secondary-text">Code ID</p>
            <p className="w-6 h-[21px] rounded animate-pulse bg-[#252525]"></p>
          </div>
          <div className="flex flex-col gap-2 w-[30%]">
            <p className="secondary-text">Code Hash</p>
            <div className="w-[255px] h-[21px] rounded animate-pulse bg-[#252525]"></div>
          </div>
          <div className="flex flex-col gap-2 w-[30%]">
            <p className="secondary-text">Creator</p>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full animate-pulse bg-[#252525]"></div>
              <div className="w-[255px] h-[21px] rounded animate-pulse bg-[#252525]"></div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-[20%]">
            <p className="secondary-text">Permission</p>
            <div className="w-[220px] h-[21px] rounded animate-pulse bg-[#252525]"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CodesLoading;
