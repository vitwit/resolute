import React from 'react';

const CustomNetworkLoading = () => {
  return (
    <div className="grid grid-cols-3 gap-10 px-6">
      {[1, 2, 3].map((_, index) => (
        <div className="customnetwork-card" key={index}>
          <div className="flex justify-between w-full">
            <div className="flex gap-1 items-center">
              <p className="w-6 h-6 animate-pulse  bg-[#252525] rounded-full"></p>
              <p className="w-[110px] h-[21px] animate-pulse  bg-[#252525] rounded"></p>
            </div>
            <div className="w-[77px] h-[31px] animate-pulse  bg-[#252525] rounded-full"></div>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-2">
              <p className="text-small-light">Network</p>
              <p className="w-[80px] h-[21px] animate-pulse  bg-[#252525] rounded"></p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-small-light">Network ID</p>
              <p className="w-[140px] h-[21px] animate-pulse  bg-[#252525] rounded"></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomNetworkLoading;
