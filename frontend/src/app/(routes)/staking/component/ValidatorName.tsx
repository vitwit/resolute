import React, { useEffect, useCallback } from 'react';
import { get } from 'lodash';
import useValidator from '@/custom-hooks/useValidator';
import ValidatorLogo from '../components/ValidatorLogo';
import { WalletAddress } from '@/components/main-layout/SelectNetwork';

interface ValidatorNameProps {
    valoperAddress: string;
    chainID: string;
}

const ValidatorName: React.FC<ValidatorNameProps> = ({ valoperAddress, chainID }) => {
    const { fetchValidator, getValidatorDetails } = useValidator();

    const memoizedFetchValidator = useCallback(() => {
        fetchValidator(valoperAddress, chainID);
    }, [valoperAddress, chainID, fetchValidator]);

    useEffect(() => {
        memoizedFetchValidator();
    }, [memoizedFetchValidator]);

    const validatorDetails = getValidatorDetails(valoperAddress, chainID);

    return (
        <div className='flex'>
            {
                !validatorDetails
                    ? 'Loading....'
                    : (
                        <>
                            {/* validator logo */}
                            <ValidatorLogo
                                width={20}
                                height={20}
                                identity={get(validatorDetails, 'description.identity', '')}
                            /> &nbsp;

                            {/* Validator name  */}
                            <p className="text-white text-sm not-italic font-normal leading-[normal]">
                                {get(validatorDetails, 'description.moniker')}
                            </p> &nbsp;

                            {/* Copy address icon */}
                            <WalletAddress address={valoperAddress} displayAddress={false} />
                        </>
                    )
            }
        </div>
    );
};

export default React.memo(ValidatorName);
