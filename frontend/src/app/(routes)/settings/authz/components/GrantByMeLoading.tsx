import React from 'react';

const FeegrantByMeLoading = () => {
  return (
    <div className="space-y-6 pt-6 px-6">
      {[1, 2,3].map((_, index) => (
        <div className="garnts-card justify-between w-full" key={index}>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <p className="w-[20px] h-[20px] bg-[#252525] rounded-full animate-pulse"></p>
              <p className="w-[41px] h-[21px] bg-[#252525] rounded animate-pulse"></p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="w-[212px] h-[21px] bg-[#252525] rounded animate-pulse"></p>
              <p className="w-[20px] h-[20px] bg-[#252525] rounded animate-pulse"></p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-b1-light">Permissions</p>
            <div className="grid grid-cols-4 gap-2 ">
              <p className="w-[120px] h-[37px] bg-[#252525] rounded animate-pulse"></p>
              <p className="w-[120px] h-[37px] bg-[#252525] rounded animate-pulse"></p>
              <p className="w-[120px] h-[37px] bg-[#252525] rounded animate-pulse"></p>
              <p className="w-[120px] h-[37px] bg-[#252525] rounded animate-pulse"></p>
            </div>
          </div>
          <div className="flex gap-6 items-end">
            <div className="w-[103px] h-[32px] bg-[#252525] rounded-full animate-pulse"></div>
            <div className="w-[79px] h-[21px] bg-[#252525] rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeegrantByMeLoading;