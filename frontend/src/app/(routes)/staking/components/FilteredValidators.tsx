import { StakingMenuAction, Validators } from '@/types/staking';
import { VALIDATORS_PER_PAGE } from '@/utils/constants';
import { getValidatorRank } from '@/utils/util';
import React, { useEffect, useState } from 'react';
import ValidatorComponent from './ValidatorComponent';
import { Pagination } from '@mui/material';
import { paginationComponentStyles } from '../styles';

interface FilteredValidatorsProps {
  filtered: string[];
  validators: Validators;
  active: boolean;
  onMenuAction: StakingMenuAction;
}

const FilteredValidators = ({
  filtered,
  validators,
  active,
  onMenuAction,
}: FilteredValidatorsProps) => {
  const [slicedValidators, setSlicedValidators] = useState<string[]>([]);

  useEffect(() => {
    if (filtered.length < VALIDATORS_PER_PAGE) {
      setSlicedValidators(filtered);
    } else {
      setSlicedValidators(filtered?.slice(0, 1 * VALIDATORS_PER_PAGE));
    }
  }, [filtered]);

  return (
    <>
      {slicedValidators.length ? (
        <>
          <div className="flex flex-col gap-6">
            {slicedValidators?.map((validatorAddress) => {
              const validatorsSet = active
                ? validators.active
                : validators.inactive;
              let rank;
              if (active) {
                rank = getValidatorRank(
                  validatorAddress,
                  validators.activeSorted
                );
              } else {
                rank = getValidatorRank(validatorAddress, [
                  ...validators.activeSorted,
                  ...validators.inactiveSorted,
                ]);
              }
              const { moniker, identity } =
                validatorsSet[validatorAddress]?.description;
              const commission =
                Number(
                  validatorsSet[validatorAddress]?.commission?.commission_rates
                    .rate
                ) * 100;
              const jailed = validatorsSet[validatorAddress]?.jailed;
              const status = validatorsSet[validatorAddress]?.status;

              return (
                <ValidatorComponent
                  key={validatorAddress}
                  moniker={moniker}
                  identity={identity}
                  commission={commission}
                  jailed={jailed}
                  status={status}
                  active={active}
                  rank={rank}
                  onMenuAction={onMenuAction}
                  validator={validatorsSet[validatorAddress]}
                />
              );
            })}
          </div>
          <div className="w-full h-[0.25px] bg-[#FFFFFF66] my-6"></div>
          <div className="absolute bottom-12 right-10">
            <Pagination
              sx={paginationComponentStyles}
              count={Math.ceil(filtered?.length / VALIDATORS_PER_PAGE)}
              shape="circular"
              onChange={(_, v) => {
                setSlicedValidators(
                  filtered?.slice(
                    (v - 1) * VALIDATORS_PER_PAGE,
                    v * VALIDATORS_PER_PAGE
                  )
                );
              }}
            />
          </div>
        </>
      ) : (
        <div className="text-white text-center">No validators found</div>
      )}
    </>
  );
};

export default FilteredValidators;
