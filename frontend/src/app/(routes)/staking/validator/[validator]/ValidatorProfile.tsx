'use client';

import TopNav from '@/components/TopNav';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ValidatorsTable from './components/ValidatorsTable';
import useInitAllValidator from '@/custom-hooks/useInitAllValidator';
import useGetValidatorInfo from '@/custom-hooks/useGetValidatorInfo';
import { capitalizeFirstLetter, formatValidatorStatsValue } from '@/utils/util';
import ValidatorLogo from '../../components/ValidatorLogo';
import { Tooltip } from '@mui/material';
import { WITVAL } from '@/utils/constants';

const ValidatorProfile = ({ moniker }: { moniker: string }) => {
  const tabs = ['Profile', 'Announcements', 'Inbox', 'Notices'];
  const selectedTab = 'profile';
  useInitAllValidator();
  const { getChainwiseValidatorInfo,
    getOasisValidatorInfo,
    getPolygonValidatorInfo, getValidatorStats } =
    useGetValidatorInfo();
  const {
    chainWiseValidatorData,
    validatorDescription,
    validatorIdentity,
    validatorWebsite,
  } = getChainwiseValidatorInfo({ moniker });

  const validatorStatsResult = getValidatorStats({
    data: chainWiseValidatorData,
    moniker: moniker,
  });

  const { avgCommission,
    activeNetworks,
    totalNetworks } = validatorStatsResult;

  let { totalDelegators,
    totalStaked, } = validatorStatsResult

  const { totalStakedInUSD: totalPolygonStaked, totalDelegators: totalPolygonDelegators } = getPolygonValidatorInfo()
  const { totalStakedInUSD: totalOasisStaked, totalDelegators: totalOasisDelegator } = getOasisValidatorInfo()

  totalStaked += totalPolygonStaked || 0
  totalStaked += totalOasisStaked || 0
  totalDelegators += totalPolygonDelegators
  totalDelegators += totalOasisDelegator

  return (
    <div className="py-6 px-10 space-y-10 h-screen flex flex-col">
      <div className="space-y-10">
        <div className="flex justify-between">
          <h2 className="text-[20px] leading-normal font-normal">
            Validator Profile
          </h2>
          <TopNav />
        </div>
        <div className="flex gap-10 items-center border-b-[1px] border-[#ffffff1e]">
          {tabs.map((tab) => (
            <div key={tab} className="flex flex-col justify-center">
              <div
                className={
                  selectedTab === tab.toLowerCase()
                    ? 'validator-profile-menu-item font-semibold'
                    : 'validator-profile-menu-item font-normal'
                }
              >
                {tab === 'Profile' ? (
                  <span>{tab}</span>
                ) : (
                  <Tooltip title={'Coming Soon...'} placement="bottom">
                    <span>{tab}</span>
                  </Tooltip>
                )}
              </div>
              {selectedTab === tab.toLowerCase() ? (
                <div className="rounded-full h-[3px] primary-gradient"></div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-10 overflow-y-scroll">
        <div className="grid grid-cols-2 gap-10">
          <ValidatorMetadataCard
            description={validatorDescription}
            identity={validatorIdentity}
            moniker={moniker}
            website={validatorWebsite}
          />
          <ValidatorStatsCard
            totalDelegators={totalDelegators}
            totalStaked={totalStaked}
            avgCommission={avgCommission}
            totalNetworks={totalNetworks}
            activeNetworks={activeNetworks}
          />
        </div>
        <ValidatorsTable
          data={chainWiseValidatorData}
          isWitval={moniker.toLowerCase() === WITVAL}
        />
      </div>
    </div>
  );
};

export default ValidatorProfile;

const ValidatorMetadataCard = ({
  description,
  identity,
  website,
  moniker,
}: {
  description: string;
  identity: string;
  website: string;
  moniker: string;
}) => {
  return (
    <div className="bg-[#0E0B26] p-6 space-y-6 rounded-2xl">
      <div className="flex gap-2 items-center h-8">
        <ValidatorLogo identity={identity} height={24} width={24} />
        <div className="text-[18px] leading-[21.7px]">
          {
            moniker.toLowerCase() === WITVAL ? 'VITWIT' : capitalizeFirstLetter(moniker)
          }
        </div>
      </div>
      <div className="space-y-10">
        <div className="space-y-2">
          <div className="text-[#FFFFFF80] text-[14px]">Description</div>
          <div className="text-[16px] leading-[30px]">{
            moniker.toLowerCase() === WITVAL ?
              'Vitwit excels in providing top-notch infrastructure services for the Cosmos blockchain ecosystem. We specialize in setting up and managing validators, relayers, and offering expert advisory services.' : description || '-'}</div>
        </div>
        {website ? (
          <div>
            <div className="space-y-4">
              <div className="text-[#FFFFFF80] text-[14px]">Website</div>
              <div className="w-fit text-[16px] h-8 leading-[30px] bg-[#FFFFFF1A] opacity-80 flex items-center gap-2 p-2 rounded-lg">
                <Link
                  href={website || '#'}
                  target="_blank"
                  className=" flex gap-2 text-[16px] leading-[19.36px] underline underline-offset-[3px]"
                >
                  {website || '-'}
                  <Image src="/link-icon.svg" height={24} width={24} alt="" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const ValidatorStatsCard = ({
  totalDelegators,
  totalStaked,
  avgCommission,
  activeNetworks,
  totalNetworks,
}: {
  totalStaked: number;
  totalDelegators: number;
  avgCommission: number;
  totalNetworks: number;
  activeNetworks: number;
}) => {
  const totalStakedAmount = formatValidatorStatsValue(totalStaked, 0);
  const totalDelegatorsCount = formatValidatorStatsValue(totalDelegators, 0);
  const parsedAvgCommission = formatValidatorStatsValue(avgCommission, 2);

  return (
    <div className="bg-[#0E0B26] p-6 space-y-6 rounded-2xl">
      <div className="text-[18px] leading-[21.7px]">Statistics</div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <StatsCard
            name="Total Staked Assets"
            value={'$ ' + totalStakedAmount}
          />
          <StatsCard name="Total Delegators" value={totalDelegatorsCount} />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <StatsCard name="Avg. Commission" value={parsedAvgCommission + '%'} />
          <StatsCard
            name="Total Networks"
            value={isNaN(totalNetworks) ? '-' : totalNetworks.toString()}
          />
          <StatsCard
            name="Active Networks"
            value={isNaN(activeNetworks) ? '-' : activeNetworks.toString()}
          />
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
      <div className="px-2 pl-[10px] text-lg font-bold leading-normal text-white">
        {value}
      </div>
    </div>
  );
};
