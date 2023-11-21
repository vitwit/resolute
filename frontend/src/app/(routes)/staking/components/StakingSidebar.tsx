import { Validators } from '@/types/staking';
import Image from 'next/image';
import React from 'react';

// TODO: Create css classes for repeated styles

const StakingSidebar = ({ validators }: { validators: Validators }) => {
  return (
    <div className="staking-sidebar">
      <div className="flex flex-col gap-6">
        <div className="flex gap-10">
          <StakingStatsCard />
          <StakingStatsCard />
        </div>
        <div className="staking-sidebar-actions">
          <button className="staking-sidebar-actions-btn">Claim All</button>
          <button className="staking-sidebar-actions-btn">
            Claim and stake all
          </button>
        </div>
      </div>
      <div className="mt-10">
        <AllValidators />
      </div>
    </div>
  );
};

export default StakingSidebar;

const StakingStatsCard = () => {
  return (
    <div className="staking-stats-card w-full flex flex-col gap-2">
      <div className="flex items-center">
        <div className="w-10 h-10 flex-center-center">
          <Image
            src="/stake-icon.svg"
            height={24}
            width={24}
            alt="Staked Balance"
          />
        </div>
        <div className="text-sm text-white font-extralight leading-normal">
          Staked Balance
        </div>
      </div>
      <div className="px-2 text-lg font-bold leading-normal text-white">
        8768
      </div>
    </div>
  );
};

const AllValidators = () => {
  const arr = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] leading-normal font-bold">All Validators</h2>
        <div className="cursor-pointer text-[#FFFFFFBF] text-[12px] font-extralight underline underline-offset-2">
          View All
        </div>
      </div>
      {arr.map((_, index) => (
        <Validator key={index} />
      ))}
    </div>
  );
};

const Validator = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <div className="bg-[#fff] rounded-full">
          <Image src="/witval-logo.png" height={40} width={40} alt="Witval" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <div className="text-[14px] font-light leading-3">Witval</div>
            <div>
              <Image
                src="/check-circle-icon.svg"
                height={16}
                width={16}
                alt="Check"
              />
            </div>
          </div>
          <div className="text-[12px] text-[#FFFFFFBF] font-extralight leading-3">
            11,200,324.044
          </div>
        </div>
      </div>
      <div className="text-[12px] text-[#FFFFFFBF] font-extralight leading-3">
        20% Commission
      </div>
      <div>
        <button className="px-3 py-[6px] primary-gradient text-[12px] leading-[20px] rounded-lg font-medium">
          Delegate
        </button>
      </div>
    </div>
  );
};
