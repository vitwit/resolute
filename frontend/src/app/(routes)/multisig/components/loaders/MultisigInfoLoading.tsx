import React from 'react';

const MultisigInfoLoading = () => {
  return (
    <div>
      <div className="flex flex-col gap-6 w-full">
        <span className="secondary-btn">Back to List</span>
        <div className="flex justify-between w-full">
          <div className="space-y-2 w-full">
            <div className="flex gap-2 items-center">
              <p className="w-10 h-10 animate-pulse bg-[#252525] rounded-full"></p>
              <p className="w-[268px] h-[42px] animate-pulse bg-[#252525] rounded"></p>
              <p className="w-[122px] h-[18px] animate-pulse bg-[#252525] rounded"></p>
            </div>
            <div className="divider-line w-full"></div>
          </div>
          <button className="w-[146px] h-10 animate-pulse bg-[#252525] rounded-full"></button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 py-0 mt-10">
        {[1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className="w-[272px] h-[112px] animate-pulse bg-[#252525] rounded"
          />
        ))}
      </div>
      <div className="w-full h-[88px] animate-pulse bg-[#252525] rounded mt-2"></div>
    </div>
  );
};

export default MultisigInfoLoading;
