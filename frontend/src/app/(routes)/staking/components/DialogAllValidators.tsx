import { Validators } from '@/types/staking';
import { formatVotingPower } from '@/utils/denom';
import {
  Avatar,
  Dialog,
  DialogContent,
  Pagination,
  Tooltip,
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type HandleClose = () => void;

const paginationComponentStyles = {
  '& .MuiPaginationItem-page': {
    color: '#fff',
    '&:hover': {
      backgroundColor: '#ffffff1a',
    },
    fontSize: '12px',
    minWidth: '24px',
    height: '24px',
    borderRadius: '4px',
  },
  '& .Mui-selected': {
    background: 'linear-gradient(180deg, #4AA29C 0%, #8B3DA7 100%)',
    '&:hover': {
      opacity: '0.95',
    },
  },
  '& .MuiPaginationItem-icon': {
    color: '#fff',
  },
  '&.Mui-disabled': {
    color: 'red',
  },
  '& .MuiPaginationItem-ellipsis, & .MuiPaginationItem-ellipsisIcon': {
    color: 'white',
  },
};

const DialogAllValidators = ({
  handleClose,
  open,
  validators,
  currency,
}: {
  handleClose: HandleClose;
  open: boolean;
  validators: Validators;
  currency: Currency;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [active, setActive] = useState<boolean>(true);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      className="opacity-95"
      PaperProps={{
        sx: {
          position: 'relative',
          height: '800px',
          borderRadius: '16px',
          background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="allvalidators px-10 py-6 flex justify-end w-[890px]">
          <div onClick={() => handleClose()}>
            <Image
              className="cursor-pointer"
              src="/close-icon.svg"
              width={24}
              height={24}
              alt="Close"
            />
          </div>
        </div>
        <div className="px-10">
          <h2 className="txt-lg font-bold text-white">All Validators</h2>
          <div className="mt-4 py-2">
            <input
              type="radio"
              name="validatorStatus"
              id="active"
              checked={active}
              onChange={() => setActive(true)}
            />
            <label className="text-white cursor-pointer" htmlFor="active">
              Active
            </label>
            <input
              type="radio"
              name="validatorStatus"
              id="inactive"
              checked={!active}
              onChange={() => setActive(false)}
            />
            <label className="text-white" htmlFor="inactive">
              Inactive
            </label>
          </div>
          <div className="my-6 h-12 flex bg-[#FFFFFF1A] items-center px-6 py-2 rounded-2xl hover:bg-[#ffffff11]">
            <div>
              <Image
                src="/search-icon.svg"
                width={24}
                height={24}
                alt="Search"
              />
            </div>
            <div className='w-full'>
              <input
                className="w-full pl-2 border-none cursor-pointer focus:outline-none bg-transparent placeholder:font-custom1 placeholder:text-[14px] placeholder:text-[#FFFFFFBF] placeholder:font-extralight text-[#FFFFFFBF]"
                type="text"
                placeholder="Search Chain"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        {active ? (
          <ActiveValidators
            validators={validators}
            currency={currency}
            searchTerm={searchTerm}
          />
        ) : (
          <InactiveValidators
            validators={validators}
            currency={currency}
            searchTerm={searchTerm}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogAllValidators;

const ActiveValidators = ({
  validators,
  currency,
  searchTerm,
}: {
  validators: Validators;
  currency: Currency;
  searchTerm: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 7;
  const [slicedValidators, setSlicedValidators] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    if (validators?.activeSorted.length < PER_PAGE) {
      setSlicedValidators(validators?.activeSorted);
    } else {
      setCurrentPage(1);
      setSlicedValidators(validators?.activeSorted?.slice(0, 1 * PER_PAGE));
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
            <Filtered
              filtered={filtered}
              validators={validators}
              currency={currency}
              active={true}
            />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {slicedValidators?.map((validator, index) => {
                const moniker =
                  validators.active[validator]?.description.moniker;
                const commission =
                  Number(
                    validators.active[validator]?.commission?.commission_rates
                      .rate
                  ) * 100;
                const tokens = Number(validators.active[validator]?.tokens);

                return (
                  <ValidatorComponent
                    key={index + PER_PAGE * (currentPage - 1)}
                    moniker={moniker}
                    commission={commission}
                    tokens={tokens}
                    currency={currency}
                  />
                );
              })}
            </div>
            <div className="w-full h-[0.25px] bg-[#FFFFFF66] my-6"></div>
            <div className="absolute bottom-12 right-10">
              <Pagination
                sx={paginationComponentStyles}
                count={Math.ceil(validators?.activeSorted?.length / PER_PAGE)}
                shape="circular"
                onChange={(_, v) => {
                  setCurrentPage(v);
                  setSlicedValidators(
                    validators?.activeSorted?.slice(
                      (v - 1) * PER_PAGE,
                      v * PER_PAGE
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

const InactiveValidators = ({
  validators,
  currency,
  searchTerm,
}: {
  validators: Validators;
  currency: Currency;
  searchTerm: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 7;
  const [slicedValidators, setSlicedValidators] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);

  useEffect(() => {
    if (validators?.activeSorted.length < PER_PAGE) {
      setSlicedValidators(validators?.inactiveSorted);
    } else {
      setCurrentPage(1);
      setSlicedValidators(validators?.inactiveSorted?.slice(0, 1 * PER_PAGE));
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
    setCurrentPage(1);
  }, [searchTerm, validators?.inactiveSorted]);
  return (
    <>
      <div className="px-10">
        {searchTerm.length ? (
          <>
            <Filtered
              filtered={filtered}
              validators={validators}
              currency={currency}
              active={false}
            />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {slicedValidators?.map((validator, index) => {
                const moniker =
                  validators.inactive[validator]?.description.moniker;
                const commission =
                  Number(
                    validators.inactive[validator]?.commission?.commission_rates
                      .rate
                  ) * 100;
                const tokens = Number(validators.inactive[validator]?.tokens);

                return (
                  <ValidatorComponent
                    key={index + PER_PAGE * (currentPage - 1)}
                    moniker={moniker}
                    commission={commission}
                    tokens={tokens}
                    currency={currency}
                  />
                );
              })}
            </div>
            <div className="w-full h-[0.25px] bg-[#FFFFFF66] my-6"></div>
            <div className="absolute bottom-12 right-10">
              <Pagination
                sx={paginationComponentStyles}
                count={Math.ceil(validators?.inactiveSorted?.length / PER_PAGE)}
                shape="circular"
                onChange={(_, v) => {
                  setCurrentPage(v);
                  setSlicedValidators(
                    validators?.inactiveSorted?.slice(
                      (v - 1) * PER_PAGE,
                      v * PER_PAGE
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

const ValidatorComponent = ({
  moniker,
  commission,
  tokens,
  currency,
}: {
  moniker: string;
  commission: number;
  tokens: number;
  currency: Currency;
}) => {
  return (
    <div className="flex justify-between items-center txt-sm text-white font-normal">
      <div className="flex gap-4 items-center">
        <div className="bg-[#fff] rounded-full">
          <Avatar sx={{ width: 40, height: 40, bgcolor: deepPurple[300] }} />
        </div>
        <div className="flex flex-col gap-2 w-[200px]">
          <div className="flex gap-2 items-center cursor-default">
            <Tooltip title={moniker} placement="top">
              <div className="text-[14px] leading-normal truncate">
                {moniker}
              </div>
            </Tooltip>
            <Image
              src="/check-circle-icon.svg"
              height={16}
              width={16}
              alt="Check"
            />
          </div>
        </div>
      </div>
      <div className="leading-3">
        {formatVotingPower(tokens, currency.coinDecimals)}
      </div>
      <div className="leading-3">{commission.toFixed(2)}% Commission</div>
      <div>
        <button className="px-3 py-[6px] primary-gradient text-[12px] leading-[20px] rounded-lg font-medium">
          Delegate
        </button>
      </div>
    </div>
  );
};

const Filtered = ({
  filtered,
  validators,
  currency,
  active,
}: {
  filtered: string[];
  validators: Validators;
  currency: Currency;
  active: boolean;
}) => {
  const [slicedValidators, setSlicedValidators] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 7;

  useEffect(() => {
    if (filtered.length < PER_PAGE) {
      setSlicedValidators(filtered);
    } else {
      setCurrentPage(1);
      setSlicedValidators(filtered?.slice(0, 1 * PER_PAGE));
    }
  }, [filtered]);

  return (
    <>
      {slicedValidators.length ? (
        <>
          <div className="flex flex-col gap-6">
            {slicedValidators?.map((validator, index) => {
              let validatorsSet = validators.active;
              if (!active) {
                validatorsSet = validators.inactive;
              }
              const moniker = validatorsSet[validator]?.description.moniker;
              const commission =
                Number(
                  validatorsSet[validator]?.commission?.commission_rates.rate
                ) * 100;
              const tokens = Number(validatorsSet[validator]?.tokens);

              return (
                <ValidatorComponent
                  key={index + PER_PAGE * (currentPage - 1)}
                  moniker={moniker}
                  commission={commission}
                  tokens={tokens}
                  currency={currency}
                />
              );
            })}
          </div>
          <div className="w-full h-[0.25px] bg-[#FFFFFF66] my-6"></div>
          <div className="absolute bottom-12 right-10">
            <Pagination
              sx={paginationComponentStyles}
              count={Math.ceil(filtered?.length / PER_PAGE)}
              shape="circular"
              onChange={(_, v) => {
                setCurrentPage(v);
                setSlicedValidators(
                  filtered?.slice((v - 1) * PER_PAGE, v * PER_PAGE)
                );
              }}
            />
          </div>
        </>
      ) : (
        <>No validators found</>
      )}
    </>
  );
};
