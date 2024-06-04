import React from 'react';
import Image from 'next/image';

const ProposalStatus = () => {
  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05]">
      <div className="flex flex-col gap-2">
        <p className="text-b1">Current Status</p>
        <div className="divider-line"></div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center">
          <p className="text-white text-xs">12,547686,233</p>
          <p className="text-[#FFFFFF50] text-[10px]">Voted Yes</p>
        </div>
        <div className="flex space-x-2">
          <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
            {/* <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex"></div> */}
            <div
              style={{ width: 80 }}
              className={`yes-bg h-2 rounded-l-full `}
            ></div>
          </div>
          <Image src="/tick.png" width={12} height={12} alt="tick-icon" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center">
          <p className="text-white text-xs">12,547686,233</p>
          <p className="text-[#FFFFFF50] text-[10px]">Voted No</p>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
            {/* <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex "></div> */}
            <div
              style={{ width: 40 }}
              className={`no-bg h-2 rounded-l-full `}
            ></div>
          </div>
          <p className="text-[#FFFFFF50] text-[10px]">12%</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center">
          <p className="text-white text-xs">12,547686,233</p>
          <p className="text-[#FFFFFF50] text-[10px]">Voted Abstain</p>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
            {/* <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex "></div> */}
            <div
              style={{ width: 40 }}
              className={`abstain-bg h-2 rounded-l-full `}
            ></div>
          </div>
          <p className="text-[#FFFFFF50] text-[10px]">12%</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center">
          <p className="text-white text-xs">12,547686,233</p>
          <p className="text-[#FFFFFF50] text-[10px]">Voted Veto</p>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="bg-[#FFFFFF0D] w-full h-[10px] rounded-full">
            {/* <div className="bg-[#f0f0f3] h-[10px] w-[4px] absolute  flex"></div> */}
            <div
              style={{ width: 40 }}
              className={`veto-bg h-2 rounded-l-full `}
            ></div>
          </div>
          <p className="text-[#FFFFFF50] text-[10px]">12%</p>
        </div>
      </div>
    </div>
  );
};

export default ProposalStatus;
