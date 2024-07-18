import ValidatorLogo from '@/app/(routes)/staking/components/ValidatorLogo';
import { REDIRECT_ICON } from '@/constants/image-names';
import { useAppSelector } from '@/custom-hooks/StateHooks';
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
  const validatorsLoadingCount = useAppSelector(
    (state) => state.staking.validatorsLoading
  );
  const isLoading = validatorsLoadingCount > 0;
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ValidatorLogo identity={identity} height={32} width={32} />
            <div className="text-[28px] text-[#ffffffad] font-bold">
              {isWitval ? VITWIT : capitalizeFirstLetter(name)}
            </div>
            {!isLoading ? (
              <Link href={website} target="_blank">
                <Image src={REDIRECT_ICON} width={32} height={32} alt="" />
              </Link>
            ) : null}
          </div>
          <div className="validator-description">
            {isWitval ? VITWIT_VALIDATOR_DESCRIPTION : description || '-'}
          </div>
        </div>
        <div className="divider-line"></div>
      </div>
      <div className="flex gap-6 justify-between flex-wrap">
        <StatsCard
          name="Total Staked Assets"
          value={totalStakedAmount}
          isLoading={isLoading}
        />
        <StatsCard
          name="Total Delegators"
          value={totalDelegatorsCount}
          isLoading={isLoading}
        />
        <StatsCard
          name="Avg. Commission"
          value={parsedAvgCommission}
          isLoading={isLoading}
        />
        <StatsCard
          name="Total Networks"
          value={Number.isNaN(totalNetworks) ? '-' : totalNetworks.toString()}
          isLoading={isLoading}
        />
        <StatsCard
          name="Active Networks"
          value={Number.isNaN(activeNetworks) ? '-' : activeNetworks.toString()}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ValidatorHeader;

const StatsCard = ({
  name,
  value,
  isLoading,
}: {
  name: string;
  value: string;
  isLoading: boolean;
}) => {
  return (
    <div className={`validator-stats-card ${isLoading ? 'animate-pulse' : ''}`}>
      <div className="text-[12px] font-light leading-[18px] text-[#FFFFFF80]">
        {name}
      </div>
      <div className="text-[#ffffffad] text-[18px] font-bold">{value}</div>
    </div>
  );
};
