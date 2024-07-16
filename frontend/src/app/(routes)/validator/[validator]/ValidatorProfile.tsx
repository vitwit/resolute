'use client';

import useGetValidatorInfo from '@/custom-hooks/useGetValidatorInfo';
import useInitAllValidator from '@/custom-hooks/useInitAllValidator';
import React from 'react';
import ValidatorHeader from './components/ValidatorHeader';
import ValidatorsTable from './components/ValidatorsTable';
import { VITWIT_VALIDATOR_NAMES } from '@/utils/constants';
import SectionHeader from '@/components/common/SectionHeader';
import { capitalizeFirstLetter } from '@/utils/util';

const ValidatorProfile = ({ moniker }: { moniker: string }) => {
  useInitAllValidator();
  const {
    getChainwiseValidatorInfo,
    getOasisValidatorInfo,
    getPolygonValidatorInfo,
    getValidatorStats,
  } = useGetValidatorInfo();
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

  const { avgCommission, activeNetworks, totalNetworks } = validatorStatsResult;

  let { totalDelegators, totalStaked } = validatorStatsResult;

  const {
    totalStakedInUSD: totalPolygonStaked,
    totalDelegators: totalPolygonDelegators,
  } = getPolygonValidatorInfo();
  const {
    totalStakedInUSD: totalOasisStaked,
    totalDelegators: totalOasisDelegator,
  } = getOasisValidatorInfo();

  totalStaked += totalPolygonStaked || 0;
  totalStaked += totalOasisStaked || 0;
  totalDelegators += totalPolygonDelegators;
  totalDelegators += totalOasisDelegator;
  return (
    <div className="py-10 space-y-10">
      <ValidatorHeader
        activeNetworks={activeNetworks}
        avgCommission={avgCommission}
        description={validatorDescription}
        identity={validatorIdentity}
        name={moniker}
        totalDelegators={totalDelegators}
        totalNetworks={totalNetworks}
        totalStaked={totalStaked}
        website={validatorWebsite}
      />
      <div className="space-y-6">
        <SectionHeader
          title="Networks"
          description={`Networks supported by ${capitalizeFirstLetter(moniker)}`}
        />
        <ValidatorsTable
          data={chainWiseValidatorData}
          isWitval={VITWIT_VALIDATOR_NAMES.includes(moniker.toLowerCase())}
        />
      </div>
    </div>
  );
};

export default ValidatorProfile;
