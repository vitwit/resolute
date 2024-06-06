import React, { useEffect, useCallback } from 'react';
import { get } from 'lodash';
import useValidator from '@/custom-hooks/useValidator';
import ValidatorLogo from '../components/ValidatorLogo';
import { WalletAddress } from '@/components/main-layout/SelectNetwork';

interface ValidatorNameProps {
  valoperAddress: string;
  chainID: string;
  hasStatus?: boolean;
}

interface ValStatusObj {
  [key: string]: string;
}

const valStatusObj: ValStatusObj = {
  BOND_STATUS_BONDED: 'Active',
  BOND_STATUS_UNBONDED: 'InActive',
};

const ValidatorName: React.FC<ValidatorNameProps> = ({
  valoperAddress,
  chainID,
  hasStatus
}) => {
  const { fetchValidator, getValidatorDetails } = useValidator();

  const memoizedFetchValidator = useCallback(() => {
    fetchValidator(valoperAddress, chainID);
  }, [valoperAddress, chainID, fetchValidator]);

  useEffect(() => {
    memoizedFetchValidator();
  }, [memoizedFetchValidator]);

  const validatorDetails = getValidatorDetails(valoperAddress, chainID);

  return (
    <div className="flex space-x-1">
      {!validatorDetails ? (
        'Loading....'
      ) : (
        <>
          {/* validator logo */}
          <ValidatorLogo
            width={24}
            height={24}
            identity={get(validatorDetails, 'description.identity', '')}
          />{' '}
          &nbsp;
          {/* Validator name  */}
          <p className="text-b1 flex items-center">
            {get(validatorDetails, 'description.moniker')}
          </p>{' '}
          &nbsp;
          {/* Copy address icon */}
          <WalletAddress address={valoperAddress} displayAddress={false} />

          {
            hasStatus ?
              <div className={`border  h-5 items-center ${valStatusObj[get(validatorDetails, 'status', '')]==='Active'?'bg-green-900 border-green': 'bg-red-600 border-red'} text-sm px-3 text-white rounded-[25px] relative`}>
                {get(validatorDetails, 'jailed') ? 'Jailed' : valStatusObj[get(validatorDetails, 'status') || '']}
              </div> : null
          }

        </>
      )}
    </div>
  );
};

export default React.memo(ValidatorName);
