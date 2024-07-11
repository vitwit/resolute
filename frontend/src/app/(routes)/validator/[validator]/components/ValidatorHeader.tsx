import ValidatorLogo from '@/app/(routes)/staking/components/ValidatorLogo';
import { REDIRECT_ICON } from '@/constants/image-names';
import {
  VITWIT,
  VITWIT_VALIDATOR_DESCRIPTION,
  WITVAL,
} from '@/utils/constants';
import { capitalizeFirstLetter, formatValidatorStatsValue } from '@/utils/util';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ValidatorHeaderProps {
  name: string;
  website: string;
  identity: string;
  description: string;
  totalStaked: number;
  totalDelegators: number;
  avgCommission: number;
  totalNetworks: number;
  activeNetworks: number;
}

const ValidatorHeader = (props: ValidatorHeaderProps) => {
  const {
    activeNetworks,
    avgCommission,
    description,
    identity,
    name,
    totalDelegators,
    totalNetworks,
    totalStaked,
    website,
  } = props;
  const isWitval = name.toLowerCase() === WITVAL;
  const totalStakedAmount = formatValidatorStatsValue(totalStaked, 0);
  const totalDelegatorsCount = formatValidatorStatsValue(totalDelegators, 0);
  const parsedAvgCommission = formatValidatorStatsValue(avgCommission, 2);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ValidatorLogo identity={identity} height={32} width={32} />
            <div className="text-[28px] text-[#ffffffad] font-bold">
              {isWitval ? VITWIT : capitalizeFirstLetter(name)}
            </div>
            <Link href={website}>
              <Image src={REDIRECT_ICON} width={32} height={32} alt="" />
            </Link>
          </div>
          <div className="text-[#FFFFFF80] font-extralight text-[14px] leading-8">
            {isWitval ? VITWIT_VALIDATOR_DESCRIPTION : description || '-'}
          </div>
        </div>
        <div className="divider-line"></div>
      </div>
      <div className="flex gap-6 justify-between flex-wrap">
        <StatsCard name="Total Staked Assets" value={totalStakedAmount} />
        <StatsCard name="Total Delegators" value={totalDelegatorsCount} />
        <StatsCard name="Avg. Commission" value={parsedAvgCommission} />
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
  );
};

export default ValidatorHeader;

const StatsCard = ({ name, value }: { name: string; value: string }) => {
  return (
    <div className="bg-[#FFFFFF05] p-4 flex flex-col gap-2 items-center justify-center flex-1 rounded-2xl">
      <div className="text-[12px] font-light leading-[18px] text-[#FFFFFF80]">
        {name}
      </div>
      <div className="text-[#ffffffad] text-[18px] font-bold">{value}</div>
    </div>
  );
};
