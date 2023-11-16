import Image from 'next/image';
import React from 'react';

const StakingSidebar = () => {
  return (
    <div className="staking-sidebar w-[500px] bg-[#0E0B2633] h-screen min-h-[800px] overflow-y-scroll no-scrollbar">
      <div className='flex gap-10'>
        <StakingStatsCard />
        <StakingStatsCard />
      </div>
    </div>
  );
};

export default StakingSidebar;

const StakingStatsCard = () => {
  return (
    <div className="staking-stats-card w-full">
      <div className="flex items-center">
        <div className="w-10 h-10 flex justify-center items-center">
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
