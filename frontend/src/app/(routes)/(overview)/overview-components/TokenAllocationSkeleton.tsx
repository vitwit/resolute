import React from 'react';

function TokenAllocationSkeleton() {
  return (
    <div>
      <div className="flex gap-10">
        <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
        <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
        <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
        <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
        <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
        <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export default TokenAllocationSkeleton;
