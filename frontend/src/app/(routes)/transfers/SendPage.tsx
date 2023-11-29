import useSortedAssets from '@/custom-hooks/useSortedAssets';
import React, { useState } from 'react';
import Image from 'next/image';
import { capitalizeFirstLetter } from '../../../utils/util';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { CircularProgress, InputAdornment, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

type SetSelectedAssetAction = React.Dispatch<
  React.SetStateAction<ParsedAsset | undefined>
>;

const SendPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const [sortedAssets] = useSortedAssets(chainIDs);
  const [openMemo, setOpenMemo] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<ParsedAsset | undefined>();
  const slicedAssets = sortedAssets.slice(0, 4);
  const {
    handleSubmit,
    control,

    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
      address: '',
      memo: '',
    },
  });

  const onSubmit = (data: { amount: number; address: string }) => {
    alert('submitted...' + data.address);
  };

  return (
    <div className="h-full w-full space-y-6">
      <div className="space-y-4">
        <div>Assets</div>
        <Cards
          assets={slicedAssets}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
        <div className="w-fill flex justify-center h-6 text-[#c3c2c9] text-xs not-italic font-normal leading-6 underline">
          {sortedAssets.length > 4 ? 'View All' : ''}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div>
            <div className="text-sm not-italic font-normal leading-[normal] mb-2">
              Enter Address
            </div>
            <Controller
              name="address"
              control={control}
              rules={{
                required: 'Address is required',
                validate: (value) => {
                  return value.length > 0 && value.length <= 5;
                },
              }}
              render={({ field }) => (
                <TextField
                  className="bg-[#FFFFFF0D] rounded-2xl"
                  {...field}
                  required
                  fullWidth
                  size="small"
                  placeholder="Enter Address here"
                  sx={{
                    '& .MuiTypography-body1': {
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 200,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                  InputProps={{
                    sx: {
                      input: {
                        color: 'white',
                        fontSize: '14px',
                        padding: 2,
                      },
                    },
                  }}
                  error={!!errors.amount}
                />
              )}
            />
            <div
              className={`text-red-500 text-xs px-4 opacity-95 mt-1 min-h-[24px]`}
            >
              {errors.address?.type === 'validate'
                ? 'Enter a valid address.'
                : errors.address?.message}
            </div>
            <div className="text-sm not-italic font-normal leading-[normal] mb-2">
              Amount
            </div>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: 'Amount is required',
                validate: (value) => {
                  return Number(value) > 0;
                },
              }}
              render={({ field }) => (
                <TextField
                  className="bg-[#FFFFFF0D] rounded-2xl"
                  {...field}
                  required
                  fullWidth
                  size="small"
                  placeholder="Enter Amount here"
                  sx={{
                    '& .MuiTypography-body1': {
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 200,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        {selectedAsset?.displayDenom}
                      </InputAdornment>
                    ),
                    sx: {
                      input: {
                        color: 'white',
                        fontSize: '14px',
                        padding: 2,
                      },
                    },
                  }}
                  error={!!errors.amount}
                />
              )}
            />

            <div
              className={`text-red-500 text-xs px-4 opacity-95 mt-1 min-h-[24px]`}
            >
              {errors.amount?.type === 'validate'
                ? 'Insufficient funds. Please make sure you have enough balance.'
                : errors.amount?.message}
            </div>
            <div className="min-h-[96px]">
              <div className="flex items-center gap-2  mb-2">
                <div className="flex items-center text-sm not-italic font-normal leading-[normal]">
                  Memo
                </div>
                <Image
                  onClick={() => setOpenMemo((openMemo) => !openMemo)}
                  src="/drop-down-icon.svg"
                  width={16}
                  height={16}
                  alt=""
                />
              </div>
              {openMemo ? (
                <Controller
                  name="memo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      className="bg-[#FFFFFF0D] rounded-2xl"
                      {...field}
                      required
                      fullWidth
                      size="small"
                      placeholder="Enter Memo here"
                      sx={{
                        '& .MuiTypography-body1': {
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 200,
                          height: '100px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                      }}
                      InputProps={{
                        sx: {
                          input: {
                            color: 'white',
                            fontSize: '14px',
                            padding: 2,
                          },
                        },
                      }}
                      error={!!errors.memo}
                    />
                  )}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="h-full flex gap-10 items-center">
          <button type="submit" className="primary-action-btn">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendPage;

const Cards = ({
  assets,
  selectedAsset,
  setSelectedAsset,
}: {
  assets: ParsedAsset[];
  selectedAsset: ParsedAsset | undefined;
  setSelectedAsset: SetSelectedAssetAction;
}) => {
  const balancesLoading = useAppSelector((state) => state.bank.balancesLoading);
  return (
    <div className="flex items-center justify-start gap-4 min-h-[100px] max-h-[100px]">
      {assets.length ? (
        assets.map((asset) => (
          <div
            className={
              'w-1/4 card p-4 cursor-pointer' +
              (asset.denom === selectedAsset?.denom &&
              asset.chainID === selectedAsset?.chainID
                ? ' selected'
                : '')
            }
            key={asset.chainName + ' ' + asset.displayDenom}
            onClick={() => setSelectedAsset(asset)}
          >
            <div className="flex gap-2">
              <Image
                src={asset.chainLogoURL}
                width={32}
                height={32}
                alt={asset.chainName}
              />
              <div className="flex items-center text-[14]">
                {capitalizeFirstLetter(asset.chainName)}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="text-base not-italic font-bold leading-[normal]">
                {asset.balance}
              </div>
              <div className="text-[#9c95ac] text-xs not-italic font-normal leading-[normal] flex items-center">
                {asset.displayDenom}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          {balancesLoading ? (
            <CircularProgress size={30} />
          ) : (
            <>- No Assets -</>
          )}
        </div>
      )}
    </div>
  );
};
