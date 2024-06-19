import React, { useEffect, useCallback } from 'react';
import { get } from 'lodash';
import useValidator from '@/custom-hooks/useValidator';
import ValidatorLogo from '../components/ValidatorLogo';
import { WalletAddress } from '@/components/main-layout/SelectNetwork';
import { Tooltip } from '@mui/material';

interface ValidatorNameProps {
  valoperAddress: string;
  chainID: string;
  hasStatus?: boolean;
  smallFont?: boolean;
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
  hasStatus,
  smallFont,
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
    <div className="flex space-x-1 items-center">
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
          <Tooltip title={get(validatorDetails, 'description.moniker')}>
            <p
              className={` ${smallFont ? 'text-[18px]' : 'text-b1'} flex items-center truncate`}
            >
              {get(validatorDetails, 'description.moniker')}
            </p>
          </Tooltip>
          &nbsp;
          {/* Copy address icon */}
          <WalletAddress address={valoperAddress} displayAddress={false} />
          {hasStatus ? (
            // If the status is Active than use this css "status-active"
            // If the status is Jailed than we can use this "status-jailed"
            //And the status is Unbonded  we can use this "status-unbonded"
            <div
              className={`h-5 text-[8px] ${valStatusObj[get(validatorDetails, 'status', '')] === 'Active' ? 'status-active' : ''}
              ${get(validatorDetails, 'jailed') ? 'status-jailed' : valStatusObj[get(validatorDetails, 'status', '')] === 'InActive' ? 'status-unbonded' : ''} relative`}
            >
              {get(validatorDetails, 'jailed')
                ? 'Jailed'
                : valStatusObj[get(validatorDetails, 'status') || '']}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default React.memo(ValidatorName);
