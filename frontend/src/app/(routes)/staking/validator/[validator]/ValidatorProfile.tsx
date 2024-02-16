'use client';
import TopNav from '@/components/TopNav';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import ValidatorsTable from './components/ValidatorsTable';

const ValidatorProfile = ({ moniker }: { moniker: string }) => {
  const tabs = ['Profile', 'Announcements', 'Inbox', 'Notices'];
  const [selectedTab, setSelectedTab] = useState('profile');
  return (
    <div className="py-6 px-10 space-y-10">
      <div className="flex justify-between">
        <h2 className="text-[20px] leading-normal font-normal">
          Validator Profile
        </h2>
        <TopNav />
      </div>
      <div className="flex gap-10 items-center border-b-[1px] border-[#ffffff1e]">
        {tabs.map((tab) => (
          <div key={tab} className="flex flex-col justify-center">
            <div className="px-2 text-[18px] h-9 flex items-center pb-[14px] font-semibold leading-[21.7px]">
              {tab}
            </div>
            {selectedTab === tab.toLowerCase() ? (
              <div className="rounded-full h-[3px] primary-gradient"></div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-10">
        <ValidatorMetadataCard />
        <ValidatorStatsCard />
      </div>
      <ValidatorsTable />
    </div>
  );
};

export default ValidatorProfile;

const ValidatorMetadataCard = () => {
  return (
    <div className="bg-[#0E0B26] p-6 space-y-6 rounded-2xl">
      <div className="flex gap-2 items-center h-8">
        <Image
          src="/akash-logo.svg"
          alt={'Cosmostation'}
          width={24}
          height={24}
        />
        <div className="text-[18px] leading-[21.7px]">Cosmostation</div>
      </div>
      <div className="space-y-10">
        <div className="space-y-2">
          <div className="text-[#FFFFFF80] text-[14px]">Description</div>
          <div className="text-[16px] leading-[30px]">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi,
            quaerat. Animi alias libero quam incidunt aspernatur atque amet nisi
            numquam!
          </div>
        </div>
        <div>
          <div className="space-y-4">
            <div className="text-[#FFFFFF80] text-[14px]">Website</div>
            <div className="w-fit text-[16px] h-8 leading-[30px] bg-[#FFFFFF1A] opacity-80 flex items-center gap-2 p-2 rounded-lg">
              <Link
                href="https://www.cosmostation.io"
                target="_blank"
                className="text-[16px] leading-[19.36px] underline underline-offset-[3px]"
              >
                https://www.cosmostation.io
              </Link>
              <Image src="/link-icon.svg" height={24} width={24} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ValidatorStatsCard = () => {
  return (
    <div className="bg-[#0E0B26] p-6 space-y-6 rounded-2xl">
      <div className="text-[18px] leading-[21.7px]">Statistics</div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <StatsCard name="Total Staked Assets" value="$ 432,233,123" />
          <StatsCard name="Total Staked Assets" value="$ 432,233,123" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <StatsCard name="Total Staked Assets" value="$ 432,233,123" />
          <StatsCard name="Total Staked Assets" value="$ 432,233,123" />
          <StatsCard name="Total Staked Assets" value="$ 432,233,123" />
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ name, value }: { name: string; value: string }) => {
  return (
    <div className="stats-sub-card w-full flex flex-col gap-2">
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
