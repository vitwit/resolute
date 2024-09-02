import React from 'react';

const TxnsLoading = () => {
  return (
    <div className="space-y-6 px-6">
      {Array(3)
        .fill(null)
        .map((index) => (
          <div key={index} className="h-[128px] w-full flex gap-6">
            <div className="w-[122px] h-full flex flex-col">
              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <p className="h-[18px] w-full animate-pulse rounded-2xl bg-[#252525]"></p>
                <p className="v-line"></p>
                <div className="w-6 h-6 bg-[#252525] animate-pulse rounded-full"></div>
                <p className="v-line"></p>
              </div>
            </div>
            <div className="flex-1 rounded-2xl animate-pulse bg-[#252525] h-full txn-card">
              <div className="space-y-6 flex-1">
                <div className="flex justify-between gap-6 w-[70%]">
                  <div className="bg-[#252525] animate-pulse rounded h-[18px] w-[220px]"></div>
                  <div className="flex flex-wrap gap-4 w-[50%]">
                    <div className="w-20 h-8 bg-[#252525] animate-pulse rounded"></div>
                    <div className="w-20 h-8 bg-[#252525] animate-pulse rounded"></div>
                  </div>
                </div>
                <div>
                  <div className="h-5 bg-[#252525] animate-pulse rounded w-[60%]"></div>
                </div>
              </div>
              <div className="w-[82px] h-8 bg-[#252525] animate-pulse rounded-full"></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TxnsLoading;
