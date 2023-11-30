import { StakingMenuAction, Validators } from '@/types/staking';
import { VALIDATORS_PER_PAGE } from '@/utils/constants';
import { getValidatorRank } from '@/utils/util';
import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ValidatorComponent from './ValidatorComponent';
import FilteredValidators from './FilteredValidators';
import { paginationComponentStyles } from '../styles';

interface InactiveValidators {
  validators: Validators;
  searchTerm: string;
  onMenuAction: StakingMenuAction;
}

const InactiveValidators = ({
  validators,
  searchTerm,
  onMenuAction,
}: InactiveValidators) => {
  const [slicedValidators, setSlicedValidators] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    if (validators?.activeSorted.length < VALIDATORS_PER_PAGE) {
      setSlicedValidators(validators?.inactiveSorted);
    } else {
      setSlicedValidators(
        validators?.inactiveSorted?.slice(0, 1 * VALIDATORS_PER_PAGE)
      );
    }
  }, [validators?.inactiveSorted]);

  useEffect(() => {
    const filteredValidators = validators?.inactiveSorted.filter(
      (validator) =>
        validators.inactive[validator]?.description.moniker
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredValidators);
  }, [searchTerm, validators?.inactiveSorted]);
  return (
    <>
      <div className="px-10">
        {searchTerm.length ? (
          <>
            <FilteredValidators
              filtered={filtered}
              validators={validators}
              active={false}
              onMenuAction={onMenuAction}
            />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {slicedValidators?.map((validator) => {
                const moniker =
                  validators.inactive[validator]?.description.moniker;
                const identity =
                  validators.inactive[validator]?.description.identity;
                const commission =
                  Number(
                    validators.inactive[validator]?.commission?.commission_rates
                      .rate
                  ) * 100;
                const jailed = validators.inactive[validator]?.jailed;
                const status = validators.inactive[validator]?.status;
                const rank = getValidatorRank(validator, [
                  ...validators.activeSorted,
                  ...validators.inactiveSorted,
                ]);

                return (
                  <ValidatorComponent
                    key={validator}
                    moniker={moniker}
                    identity={identity}
                    commission={commission}
                    jailed={jailed}
                    status={status}
                    active={false}
                    rank={rank}
                    onMenuAction={onMenuAction}
                    validator={validators.inactive[validator]}
                  />
                );
              })}
            </div>
            <div className="w-full h-[0.25px] bg-[#FFFFFF66] my-6"></div>
            <div className="absolute bottom-12 right-10">
              <Pagination
                sx={paginationComponentStyles}
                count={Math.ceil(
                  validators?.inactiveSorted?.length / VALIDATORS_PER_PAGE
                )}
                shape="circular"
                onChange={(_, v) => {
                  setSlicedValidators(
                    validators?.inactiveSorted?.slice(
                      (v - 1) * VALIDATORS_PER_PAGE,
                      v * VALIDATORS_PER_PAGE
                    )
                  );
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default InactiveValidators;
