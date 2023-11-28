import { StakingMenuAction, Validators } from '@/types/staking';
import { VALIDATORS_PER_PAGE } from '@/utils/constants';
import { getValidatorRank } from '@/utils/util';
import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ValidatorComponent from './ValidatorComponent';
import FilteredValidators from './FilteredValidators';
import { paginationComponentStyles } from '../styles';

interface ActiveValidators {
  validators: Validators;
  searchTerm: string;
  onMenuAction: StakingMenuAction;
}

const ActiveValidators = ({
  validators,
  searchTerm,
  onMenuAction,
}: ActiveValidators) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [slicedValidators, setSlicedValidators] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    if (validators?.activeSorted.length < VALIDATORS_PER_PAGE) {
      setSlicedValidators(validators?.activeSorted);
    } else {
      setCurrentPage(1);
      setSlicedValidators(
        validators?.activeSorted?.slice(0, 1 * VALIDATORS_PER_PAGE)
      );
    }
  }, [validators?.activeSorted]);

  useEffect(() => {
    const filteredValidators = validators?.activeSorted.filter(
      (validator) =>
        validators.active[validator]?.description.moniker
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredValidators);
    setCurrentPage(1);
  }, [searchTerm, validators?.activeSorted]);
  return (
    <>
      <div className="px-10">
        {searchTerm.length ? (
          <>
            <FilteredValidators
              filtered={filtered}
              validators={validators}
              active={true}
              onMenuAction={onMenuAction}
            />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {slicedValidators?.map((validator, index) => {
                const moniker =
                  validators.active[validator]?.description.moniker;
                const identity =
                  validators.active[validator]?.description.identity;
                const commission =
                  Number(
                    validators.active[validator]?.commission?.commission_rates
                      .rate
                  ) * 100;
                const jailed = validators.active[validator]?.jailed;
                const status = validators.active[validator]?.status;
                const rank = getValidatorRank(
                  validator,
                  validators.activeSorted
                );

                return (
                  <ValidatorComponent
                    key={index + VALIDATORS_PER_PAGE * (currentPage - 1)}
                    moniker={moniker}
                    identity={identity}
                    commission={commission}
                    jailed={jailed}
                    status={status}
                    active={true}
                    rank={rank}
                    onMenuAction={onMenuAction}
                    validator={validators.active[validator]}
                  />
                );
              })}
            </div>
            <div className="w-full h-[0.25px] bg-[#FFFFFF66] my-6"></div>
            <div className="absolute bottom-12 right-10">
              <Pagination
                sx={paginationComponentStyles}
                count={Math.ceil(
                  validators?.activeSorted?.length / VALIDATORS_PER_PAGE
                )}
                shape="circular"
                onChange={(_, v) => {
                  setCurrentPage(v);
                  setSlicedValidators(
                    validators?.activeSorted?.slice(
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

export default ActiveValidators;
