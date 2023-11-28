import { TxStatus } from '@/types/enums';
import { DelegationResponse, Params, Validator } from '@/types/staking';
import { formatCoin } from '@/utils/util';
import {
  Dialog,
  DialogContent,
  InputAdornment,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

function parseDelegation({
  delegations,
  validator,
  currency,
}: {
  delegations: DelegationResponse[];
  validator: Validator | undefined;
  currency: Currency;
}) {
  let result = 0.0;
  delegations?.map((item) => {
    if (item.delegation.validator_address === validator?.operator_address) {
      result +=
        parseFloat(item.delegation.shares) / 10 ** currency?.coinDecimals;
    }
  });

  return result;
}

const DialogUndelegate = ({
  open,
  onClose,
  validator,
  stakingParams,
  onUndelegate,
  loading,
  delegations,
  currency,
}: {
  open: boolean;
  onClose: () => void;
  validator: Validator | undefined;
  stakingParams: Params | undefined;
  onUndelegate: (data: { validator: string; amount: number }) => void;
  loading: TxStatus;
  delegations: DelegationResponse[];
  currency: Currency;
}) => {
  const handleClose = () => {
    onClose();
  };

  const delegationShare = parseDelegation({ delegations, validator, currency });
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = (data: { amount: number }) => {
    onUndelegate({
      validator: validator?.operator_address || '',
      amount: data?.amount || 0,
    });
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 py-6 flex justify-end">
            <div
              onClick={() => {
                handleClose();
              }}
            >
              <Image
                className="cursor-pointer"
                src="/close-icon.svg"
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="mt-6 mb-[72px] flex gap-6 pr-10 pl-6 items-center">
            <Image
              src="/delegate-popup-image.png"
              height={360}
              width={235}
              alt="Delegate"
            />
            <div className="flex flex-col gap-10 w-full">
              <h2 className="text-[20px] font-bold leading-3">
                {validator?.description?.moniker || '-'}
              </h2>
              <div className="space-y-6">
                <div className="bg-[#FFFFFF0D] px-4 rounded-2xl opacity-80 py-2 w-full space-y-4">
                  <div className="flex gap-2">
                    <div className="w-[200px] text-[14px] font-light leading-10">
                      Commission
                    </div>
                    <div className="font-medium leading-10">
                      {Number(validator?.commission?.commission_rates?.rate) *
                        100}
                      %
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-[200px] text-[14px] font-light leading-10">
                      Available for Undelegation
                    </div>
                    <div
                      className="font-medium leading-10 cursor-pointer hover:underline underline-offset-2"
                      onClick={() => {
                        setValue('amount', delegationShare);
                      }}
                    >
                      {formatCoin(delegationShare, currency.coinDenom)}
                    </div>
                  </div>
                </div>
                <div className="bg-[#FFFFFF0D] px-4 rounded-2xl opacity-80 py-4 w-full space-y-4">
                  <div className="flex gap-2">
                    <div className="w-[200px] text-[14px] font-light leading-[24px] my-auto">
                      <p>Staking will lock your</p>
                      <p>
                        funds for{' '}
                        {Math.floor(
                          parseInt(stakingParams?.unbonding_time || '') /
                            (3600 * 24)
                        )}{' '}
                        days
                      </p>
                    </div>
                    <div className="font-medium leading-6 flex-1">
                      <ol className="list-decimal space-y-2">
                        <li>You will not receive staking rewards. </li>
                        <li>You will not be able to cancel the unbonding.</li>
                        <li>
                          You will not be able to withdraw your funds until{' '}
                          {Math.floor(
                            parseInt(stakingParams?.unbonding_time || '') /
                              (3600 * 24)
                          )}
                          + days after the undelegation.
                        </li>
                      </ol>z
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="amount"
                    control={control}
                    rules={{
                      required: 'Amount is required',
                      validate: (value) => {
                        return (
                          Number(value) > 0 && Number(value) <= delegationShare
                        );
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        className="bg-[#FFFFFF0D] rounded-2xl"
                        {...field}
                        type="number"
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
                              {currency.coinDenom}
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
                        helperText={
                          errors.amount?.type === 'validate'
                            ? 'Insufficient balance'
                            : errors.amount?.message
                        }
                      />
                    )}
                  />
                  <div className="mt-10 flex gap-10 items-center">
                    <button type="submit" className="dialog-delegate-button">
                      {loading === 'pending' ? 'Loading...' : 'Undelegate'}
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUndelegate;
