import React from 'react';
import DashboardLoading from '../overview-components/DashboardLoading';
import TokenAllocationSkeleton from '../overview-components/TokenAllocationSkeleton';
import GovSkeleton from '../overview-components/GovSkeleton';
import PortfolioSkeleton from '../overview-components/PortfolioSkeleton';

const Loading = () => {
  return (
    <div>
      <div className="flex pt-10 gap-10">
        <div className="flex flex-1">
          <div className="flex flex-col gap-10 h-[calc(100vh-104px)] overflow-y-auto pb-3">
            <PortfolioSkeleton />
            <div className="flex flex-col gap-6 w-full bg-[#ffffff05] rounded-2xl p-6">
              <div className=" flex flex-col gap-1">
                <div className="text-h2">Asset Information</div>
                <div className="flex flex-col gap-2">
                  <div className="secondary-text">
                    Your total assets information
                  </div>
                  <div className="divider-line"></div>
                </div>
              </div>
              <DashboardLoading />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10 h-[calc(100vh-104px)] pb-3">
          <div className="flex flex-col p-6 rounded-2xl bg-[#ffffff05] gap-6">
            <div className="flex gap-1 flex-col w-full">
              <div className="text-h2">Token Allocation</div>
              <div className="flex flex-col gap-2">
                <div className="secondary-text">Token Allocation</div>
                <div className="divider-line"></div>
              </div>
            </div>
            <TokenAllocationSkeleton />
          </div>
          <div className="flex flex-col p-6 rounded-2xl bg-[#ffffff05] gap-4 flex-1">
            <div className="flex flex-col gap-1 w-full">
              <div className="text-h2">Governance</div>
              <div className="flex flex-col gap-2 mb-2">
                <div className="secondary-text">Acitve proposals </div>
                <div className="divider-line"></div>
              </div>
            </div>
            <GovSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
