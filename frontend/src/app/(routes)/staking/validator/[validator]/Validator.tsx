'use client';

import useGetValidatorInfo from '@/custom-hooks/useGetValidatorInfo';
import useInitAllValidator from '@/custom-hooks/useInitAllValidator';
import React from 'react';

const Validator = ({ moniker }: { moniker: string }) => {
  useInitAllValidator();
  const { getChainwiseValidatorInfo } = useGetValidatorInfo();
  const { chainWiseValidatorData } = getChainwiseValidatorInfo({ moniker });
  return (
    <div>
      {Object.keys(chainWiseValidatorData).map((chainData) => {
        return (
          <div>
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
