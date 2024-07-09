import React from 'react';

function GovSkeleton() {
  return (
    <div className="flex flex-col  gap-4">
      {/* <div className="flex flex-col gap-2 w-full">
        <div className="text-h2">Governance</div>
        <div className="secondary-text">
          Connect your wallet now to access all the modules on{' '}
        </div>
        <div className="divider-line"></div>
      </div> */}
      <div className="h-[79px] w-[370px] bg-[#ffffff05] rounded p-4">
        <div className="flex gap-2">
          <div className="w-[64px] h-[35px] bg-[#252525] rounded animate-pulse"></div>
          <div className="flex flex-col gap-1">
            <div className="w-[266px] h-[24px] bg-[#252525] rounded animate-pulse"></div>
            <div className="flex gap-4">
              <div className="w-[80px] h-[15px] bg-[#252525] rounded animate-pulse"></div>
              <div className="w-[80px] h-[15px] bg-[#252525] rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[79px] w-[370px] bg-[#ffffff05] rounded p-4">
        <div className="flex gap-2">
          <div className="w-[64px] h-[35px] bg-[#252525] rounded animate-pulse"></div>
          <div className="flex flex-col gap-1">
            <div className="w-[266px] h-[24px] bg-[#252525] rounded animate-pulse"></div>
            <div className="flex gap-4">
              <div className="w-[80px] h-[15px] bg-[#252525] rounded animate-pulse"></div>
              <div className="w-[80px] h-[15px] bg-[#252525] rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[79px] w-[370px] bg-[#ffffff05] rounded p-4">
        <div className="flex gap-2">
          <div className="w-[64px] h-[35px] bg-[#252525] rounded animate-pulse"></div>
          <div className="flex flex-col gap-1">
            <div className="w-[266px] h-[24px] bg-[#252525] rounded animate-pulse"></div>
            <div className="flex gap-4">
              <div className="w-[80px] h-[15px] bg-[#252525] rounded animate-pulse"></div>
              <div className="w-[80px] h-[15px] bg-[#252525] rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[79px] w-[370px] bg-[#ffffff05] rounded p-4">
        <div className="flex gap-2">
          <div className="w-[64px] h-[35px] bg-[#252525] rounded animate-pulse"></div>
          <div className="flex flex-col gap-1">
            <div className="w-[266px] h-[24px] bg-[#252525] rounded animate-pulse"></div>
            <div className="flex gap-4">
              <div className="w-[80px] h-[15px] bg-[#252525] rounded animate-pulse"></div>
              <div className="w-[80px] h-[15px] bg-[#252525] rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GovSkeleton;
