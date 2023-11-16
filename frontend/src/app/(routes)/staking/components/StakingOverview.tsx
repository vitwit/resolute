import Image from 'next/image';
import React from 'react';
import './../staking.css';

const StakingOverview = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="p-10 flex-1 h-screen min-h-[800px] overflow-y-scroll no-scrollbar">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {arr.map(() => (
          <StakingCard />
        ))}
      </div>
    </div>
  );
};

export default StakingOverview;

const StakingCard = () => {
  return (
    <div className="staking-card p-4 rounded-2xl">
      <div className="flex justify-between">
        <div className="flex justify-center items-center gap-1">
          <Image
            src="/stake-fish-icon.png"
            height={32}
            width={32}
            alt="Stakefish"
          />
          <div className="txt-md font-medium">Stakefish</div>
        </div>
        <div className="flex justify-center items-center gap-1">
          <Image src="/cosmos-icon.svg" height={20} width={20} alt="Cosmos" />
          <div className="txt-sm font-extralight">Cosmos</div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex flex-col gap-2">
          <div className="txt-sm font-extralight">Staked Balance</div>
          <div className="txt-md font-bold">0.923</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="txt-sm font-extralight">Staked Balance</div>
          <div className="txt-md font-bold">0.923</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="txt-sm font-extralight">Staked Balance</div>
          <div className="txt-md font-bold">0.923</div>
        </div>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-10">
          <div className="primary-gradient rounded-lg h-[32px] w-[32px] flex items-center justify-center">
            <Image src="/claim-icon.svg" height={16} width={16} alt="Claim" />
          </div>
          <div className="primary-gradient rounded-lg h-[32px] w-[32px] flex items-center justify-center">
            <Image
              src="/claim-and-stake-icon.svg"
              height={16}
              width={16}
              alt="Claim"
            />
          </div>
        </div>
        <div>
          <Image src="/menu-icon.svg" height={32} width={32} alt="Actions" />
        </div>
      </div>
    </div>
  );
};
