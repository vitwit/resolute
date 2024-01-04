import Image from 'next/image';
import React from 'react';

const StakingStatsCard = ({ name, value }: { name: string; value: string }) => {
  return (
    <div className="staking-stats-card w-full flex flex-col gap-2">
      <div className="flex items-center">
        <div className="w-10 h-10 flex-center-center">
          <Image
            src="/stake-icon.svg"
            height={24}
            width={24}
            alt="Staked Balance"
            draggable={false}
          />
        </div>
        <div className="text-sm text-white font-extralight leading-normal">
          {name}
        </div>
      </div>
      <div className="px-2 text-lg font-bold leading-normal text-white">
        {value}
      </div>
    </div>
  );
};

export default StakingStatsCard;
