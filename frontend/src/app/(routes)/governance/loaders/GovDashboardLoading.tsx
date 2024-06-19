'use client';

import React from 'react';

const GovDashboardLoading = () => {
  return (
    <div className="px-10">
      <div className="flex flex-col w-full gap-6 py-0 pb-6 flex-1 overflow-y-scroll">
        {[1, 2, 3, 4].map((_, index) => (
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

export default GovDashboardLoading;
