import React from 'react';

// TODO: Implement select network popup and refactor styles
const SelectNetwork = () => {
  return (
    <div className="fixed-top w-full">
      <div className="flex gap-2 items-center">
        <div className="network-icon-bg"></div>
        <div className="space-y-0">
          <div className="text-[16px] text-white leading-[19px]">Cosmos</div>
          <div>
            <span className="text-[#FFFFFF80] text-[12px] leading-[15px]">
              cosmos0i2uf023n...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectNetwork;
