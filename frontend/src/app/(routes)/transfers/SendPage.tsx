import useSortedAssets from '@/custom-hooks/useSortedAssets';
import React, { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { CircularProgress, InputAdornment, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import AllAssets from './components/AllAssets';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { txBankSend } from '@/store/features/bank/bankSlice';
import { SEND_TX_FEE } from '@/utils/constants';
import { TxStatus } from '@/types/enums';

const SendPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const [sortedAssets] = useSortedAssets(chainIDs);
  const [openMemo, setOpenMemo] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<ParsedAsset | undefined>();
  const slicedAssets = sortedAssets.slice(0, 4);
  const dispatch = useAppDispatch();
  const { txSendInputs } = useGetTxInputs();
  const sendTxStatus = useAppSelector((state) => state.bank.tx.status);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
      address: '',
      memo: '',
    },
  });

  const onSelectAsset = (asset: ParsedAsset) => {
    if (selectedAsset == asset) return;
    setSelectedAsset(asset);
    reset();
  };

  const onSubmit = (data: {
    amount: number;
    address: string;
    memo: string;
  }) => {
    if (!selectedAsset) {
      alert('Please select an asset');
      return;
    }
    const txInputs = txSendInputs(
      selectedAsset.chainID,
      data.address,
      data.amount,
      data.memo
    );
    dispatch(txBankSend(txInputs));
  };

  return (
    <div className="h-full w-full space-y-6">
      <div className="space-y-4">
        <div>Assets</div>
        <Cards
          assets={slicedAssets}
          selectedAsset={selectedAsset}
          onSelectAsset={onSelectAsset}
        />

        <AllAssets
          assets={sortedAssets}
          selectedAsset={selectedAsset}
          onSelectAsset={onSelectAsset}
        />
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
                  error={!!errors.address}
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
                pattern: {
                  value: /^[0-9]+(\.[0-9]+)?$/,
                  message: 'Please enter a valid number',
                },
                validate: {
                  invalid: (value) =>
                    Number(value) > 0 || "Amount can't be zero",
                  insufficient: (value) =>
                    Number(selectedAsset?.balance) >
                      Number(value) +
                        Number(
                          SEND_TX_FEE / 10 ** (selectedAsset?.decimals || 0)
                        ) || 'Insufficient funds',
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
              {!sortedAssets.length
                ? 'No Assets Found.'
                : !selectedAsset
                  ? 'Please select an Asset'
                  : errors.amount
                    ? errors.amount?.message
                    : ''}
            </div>
            <div className="min-h-[96px]">
              <div className="flex items-center gap-2  mb-2">
                <div className="flex items-center text-sm not-italic font-normal leading-[normal]">
                  Memo
                </div>
                <Image
                  onClick={() => setOpenMemo((openMemo) => !openMemo)}
                  src="/drop-down-icon.svg"
                  className='cursor-pointer'
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
          <button
            type="submit"
            className="primary-action-btn w-[152px] h-[44px]"
          >
            {sendTxStatus === TxStatus.PENDING ? (
              <CircularProgress size={24} />
            ) : (
              'Send'
            )}
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
  onSelectAsset,
}: {
  assets: ParsedAsset[];
  selectedAsset: ParsedAsset | undefined;
  onSelectAsset: (asset: ParsedAsset) => void;
}) => {
  const balancesLoading = useAppSelector((state) => state.bank.balancesLoading);

  return assets.length ? (
    <div className=" items-center justify-start gap-4 min-h-[100px] max-h-[100px] grid grid-cols-4">
      {assets.map((asset) => (
        <div
          className={
            'card p-4 cursor-pointer' +
            (asset.denom === selectedAsset?.denom &&
            asset.chainID === selectedAsset?.chainID
              ? ' selected'
              : '')
          }
          key={asset.chainName + ' ' + asset.displayDenom}
          onClick={() => onSelectAsset(asset)}
        >
          <div className="flex gap-2">
            <Image
              src={asset.chainLogoURL}
              width={32}
              height={32}
              alt={asset.chainName}
            />
            <div className="flex items-center text-[14] text-transform">
              {asset.chainName}
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
      ))}
    </div>
  ) : (
    <div className="min-h-[100px] max-h-[100px] flex justify-center items-center">
      {balancesLoading ? <CircularProgress size={30} /> : <>- No Assets -</>}
    </div>
  );
};
