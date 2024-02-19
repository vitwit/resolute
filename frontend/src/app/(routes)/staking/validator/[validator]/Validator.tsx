'use client';

import useGetValidatorInfo from '@/custom-hooks/useGetValidatorInfo';
import useInitAllValidator from '@/custom-hooks/useInitAllValidator';
import React from 'react';

const Validator = ({ moniker }: { moniker: string }) => {
  useInitAllValidator();
  const { getChainwiseValidatorInfo } = useGetValidatorInfo();
  const {
    chainWiseValidatorData,
    validatorDescription,
    validatorIdentity,
    validatorWebsite,
  } = getChainwiseValidatorInfo({ moniker });
  return (
    <div>
      <div>{validatorDescription}</div>
      <div>{validatorIdentity}</div>
      <div>{validatorWebsite}</div>
      {Object.keys(chainWiseValidatorData).map((chainData) => {
        return (
          <div key={chainData}>
            <div>{chainData}</div>
            <div>
              {JSON.stringify(chainWiseValidatorData[chainData], undefined, 4)}
            </div>
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default Validator;
