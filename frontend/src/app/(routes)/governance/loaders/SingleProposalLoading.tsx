import React from 'react';

const SingleProposalLoading = () => {
  return (
    <div className="flex items-start gap-10 pt-20 pb-0 px-10 w-full h-full">
      <div className="flex items-start gap-10 w-full h-full">
        <div className="flex flex-col flex-1 justify-between h-full">
          <div className="flex flex-col gap-6">
            <div className="secondary-btn">Go back</div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between w-full gap-10">
                <div className="w-[585px] h-[68px] animate-pulse bg-[#252525] rounded"></div>
                <div className="w-[68px] h-[25px] animate-pulse bg-[#252525] rounded-full"></div>
              </div>
              <div className="flex gap-6 w-full">
                <div className="w-[136px] h-5 animate-pulse bg-[#252525] rounded"></div>
                <div className="w-[140px] h-5 animate-pulse bg-[#252525] rounded"></div>
              </div>
              <div className="divider-line"></div>
            </div>
            <div className="w-[692px] h-[372px] animate-pulse bg-[#252525] rounded"></div>
            <div className="w-[692px] h-[241px] animate-pulse bg-[#252525] rounded"></div>
          </div>
        </div>

        {/* Rightview */}
        <div className="flex flex-col justify-between h-full gap-5">
          <div className="w-[380px] h-[229px] animate-pulse bg-[#252525] rounded-2xl"></div>
          <div className="w-[380px] h-[289px] animate-pulse bg-[#252525] rounded-2xl"></div>
          <div className="w-[380px] h-[342px] animate-pulse bg-[#252525] rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default SingleProposalLoading;
