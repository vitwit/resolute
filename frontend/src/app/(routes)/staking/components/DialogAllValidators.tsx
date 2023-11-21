import { Validators } from '@/types/staking';
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
    width: '24px',
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
}: {
  handleClose: HandleClose;
  open: boolean;
  validators: Validators;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 7;
  const [slicedMsgs, setSlicedMsgs] = useState<string[]>([]);

  useEffect(() => {
    if (validators?.activeSorted.length < PER_PAGE) {
      setSlicedMsgs(validators?.activeSorted);
    } else {
      setCurrentPage(1);
      setSlicedMsgs(validators?.activeSorted?.slice(0, 1 * PER_PAGE));
    }
  }, [validators?.activeSorted]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      className="opacity-95"
      PaperProps={{
        sx: {
          position: 'relative',
          height: '736px',
          borderRadius: '16px',
          background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="allvalidators px-10 py-6 flex justify-end w-[890px]">
          <Image
            className="cursor-pointer"
            src="/close-icon.svg"
            width={24}
            height={24}
            alt="Close"
          />
        </div>
        <div className="px-10">
          <h2 className="txt-lg font-bold text-white">All Validators</h2>
          <div className="my-6 h-12 flex bg-[#FFFFFF1A] items-center px-6 py-2 rounded-2xl hover:bg-[#ffffff11]">
            <span>
              <Image
                src="/search-icon.svg"
                width={24}
                height={24}
                alt="Search"
              />
            </span>
            <input
              className="w-full pl-2 border-none cursor-pointer focus:outline-none bg-transparent placeholder:font-custom1 placeholder:text-[14px] placeholder:text-[#FFFFFFBF] placeholder:font-extralight text-[#FFFFFFBF]"
              type="text"
              placeholder="Search Chain"
            />
          </div>
          <div className="flex flex-col gap-6">
            {slicedMsgs?.map((validator, index) => {
              const moniker = validators.active[validator]?.description.moniker;
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
                />
              );
            })}
          </div>
          <div className="absolute bottom-12 right-10">
            <Pagination
              sx={paginationComponentStyles}
              count={Math.ceil(validators?.activeSorted?.length / PER_PAGE)}
              shape="circular"
              onChange={(_, v) => {
                setCurrentPage(v);
                setSlicedMsgs(
                  validators?.activeSorted?.slice(
                    (v - 1) * PER_PAGE,
                    v * PER_PAGE
                  )
                );
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAllValidators;

const ValidatorComponent = ({
  moniker,
  commission,
  tokens,
}: {
  moniker: string;
  commission: number;
  tokens: number;
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
              <div className="text-[14px] leading-3 truncate">{moniker}</div>
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
      <div className="leading-3">{tokens.toLocaleString()}</div>
      <div className="leading-3">{commission.toFixed(2)}% Commission</div>
      <div>
        <button className="px-3 py-[6px] primary-gradient text-[12px] leading-[20px] rounded-lg font-medium">
          Delegate
        </button>
      </div>
    </div>
  );
};
