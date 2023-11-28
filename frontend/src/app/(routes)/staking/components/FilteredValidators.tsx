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

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (filtered.length < VALIDATORS_PER_PAGE) {
      setSlicedValidators(filtered);
    } else {
      setCurrentPage(1);
      setSlicedValidators(filtered?.slice(0, 1 * VALIDATORS_PER_PAGE));
    }
  }, [filtered]);

  return (
    <>
      {slicedValidators.length ? (
        <>
          <div className="flex flex-col gap-6">
            {slicedValidators?.map((validator, index) => {
              let validatorsSet;
              let rank;
              if (active) {
                validatorsSet = validators.active;
                rank = getValidatorRank(validator, validators.activeSorted);
              } else {
                validatorsSet = validators.inactive;
                rank = getValidatorRank(validator, [
                  ...validators.activeSorted,
                  ...validators.inactiveSorted,
                ]);
              }
              const moniker = validatorsSet[validator]?.description.moniker;
              const identity = validatorsSet[validator]?.description.identity;
              const commission =
                Number(
                  validatorsSet[validator]?.commission?.commission_rates.rate
                ) * 100;
              const jailed = validatorsSet[validator]?.jailed;
              const status = validatorsSet[validator]?.status;

              return (
                <ValidatorComponent
                  key={index + VALIDATORS_PER_PAGE * (currentPage - 1)}
                  moniker={moniker}
                  identity={identity}
                  commission={commission}
                  jailed={jailed}
                  status={status}
                  active={active}
                  rank={rank}
                  onMenuAction={onMenuAction}
                  validator={validatorsSet[validator]}
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
                setCurrentPage(v);
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
