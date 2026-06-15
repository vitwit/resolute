import React from 'react';

const PortfolioSkeleton = () => {
  return (
    <div className="portfolio-bg gap-6">
      <div className="flex flex-col gap-1">
        <div className="text-h2">Portfolio</div>
        <div className="flex flex-col gap-2">
          <div className="secondary-text">Summary of assets information </div>
          <div className="divider-line"></div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6 w-full">
        <div className="h-[92px] w-[152px] bg-[#252525] rounded animate-pulse"></div>
        <div className="h-[92px] w-[152px] bg-[#252525] rounded animate-pulse"></div>
        <div className="h-[92px] w-[152px] bg-[#252525] rounded animate-pulse"></div>
        <div className="h-[92px] w-[152px] bg-[#252525] rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default PortfolioSkeleton;
