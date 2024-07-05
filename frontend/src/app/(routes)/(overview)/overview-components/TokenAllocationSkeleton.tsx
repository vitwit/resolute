import React from 'react';

function TokenAllocationSkeleton() {
  return (
    <div>
      {/* <div className="h-[150px] w-[370px] bg-[#252525] rounded animate-pulse"> */}
      <div className="flex flex-col p-6 rounded-2xl bg-[#ffffff05] w-[418px] h-[302px] gap-10">
        <div className="flex flex-col gap-2 w-full">
          <div className="text-h2">Token Allocation</div>
          <div className="secondary-text">
            Connect your wallet now to access all the modules on{' '}
          </div>
          <div className="divider-line"></div>
        </div>
        <div className="flex gap-10">
          <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
          <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
          <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
          <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
          <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
          <div className="h-[134px] w-[24px] bg-[#252525] rounded animate-pulse"></div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default TokenAllocationSkeleton;
