import { DialogRedelegateProps, Validator } from '@/types/staking';
import {
  formatCoin,
  formatUnbondingPeriod,
  parseDelegation,
} from '@/utils/util';
import {
  Autocomplete,
  Dialog,
  DialogContent,
  InputAdornment,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  dialogBoxStyles,
  textFieldInputPropStyles,
  textFieldStyles,
} from '../styles';
import { CLOSE_ICON_PATH, STAKING_DIALOG_IMAGE_PATH } from '@/utils/constants';
import { INSUFFICIENT_BALANCE } from '@/utils/errors';

interface ValidatorSet {
  [key: string]: Validator;
}

interface ValidatorInfo {
  addr: string;
  label: string;
}

function parseValidators({
  active,
  inactive,
  validator,
}: {
  active: ValidatorSet;
  inactive: ValidatorSet;
  validator: Validator | undefined;
}) {
  let result: ValidatorInfo[] = [];

  for (const v in active) {
    if (active[v]) {
      result = [...result, { addr: v, label: active[v]?.description?.moniker }];
    }
  }

  for (const v in inactive) {
    if (inactive[v] && v !== validator?.operator_address)
      result.push({
        addr: v,
        label: inactive[v].description.moniker,
      });
  }

  return result;
}

const DialogRedelegate = ({
  open,
  onClose,
  validator,
  stakingParams,
  loading,
  active,
  inactive,
  delegations,
  onRedelegate,
  currency,
}: DialogRedelegateProps) => {
  const handleClose = () => {
    onClose();
  };
  const targetValidators = parseValidators({ active, inactive, validator });
  const delegationShare = parseDelegation({ delegations, validator, currency });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
      destination: null,
    },
  });
  const onSubmit = (data: {
    amount: number;
    destination: null | { addr: string; label: string };
  }) => {
    if (validator && data.destination) {
      onRedelegate({
        amount: data.amount,
        dest: data?.destination?.addr || '',
        src: validator?.operator_address || '',
      });
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      PaperProps={dialogBoxStyles}
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
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="mt-6 mb-[72px] flex gap-6 pr-10 pl-6 items-center">
            <Image
              src={STAKING_DIALOG_IMAGE_PATH}
              height={360}
              width={235}
              alt="Redelegate"
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
                      Available for Delegation
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
                        funds for {formatUnbondingPeriod(stakingParams)} days
                      </p>
                    </div>
                    <div className="font-medium leading-6 flex-1">
                      <p>
                        You will need to undelegate in order for your staked
                        assets to be liquid again.{' '}
                      </p>
                      <p>
                        This process will take{' '}
                        {formatUnbondingPeriod(stakingParams)} days to complete.
                      </p>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-6">
                    <Controller
                      name="destination"
                      control={control}
                      defaultValue={null}
                      rules={{ required: 'Target validator is required' }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <Autocomplete
                          disablePortal
                          value={value}
                          size="small"
                          isOptionEqualToValue={(option, value) =>
                            option.addr === value.addr
                          }
                          options={targetValidators}
                          onChange={(event, item) => {
                            onChange(item);
                          }}
                          sx={{
                            '& .MuiAutocomplete-inputRoot': {
                              padding: '12px !important',
                              '& input': {
                                color: 'white',
                              },
                              '& button': {
                                color: 'white',
                              },
                            },
                            '& .MuiAutocomplete-popper': {
                              display: 'none !important',
                            },
                          }}
                          renderInput={(params) => (
                            <TextField
                              className="bg-[#FFFFFF0D] rounded-2xl"
                              {...params}
                              required
                              placeholder="Destinaiton Validator"
                              error={!!error}
                              helperText={error ? error.message : null}
                              // label="destination"
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
                            />
                          )}
                        />
                      )}
                    />
                    <div>
                      <Controller
                        name="amount"
                        control={control}
                        rules={{
                          required: 'Amount is required',
                          validate: (value) => {
                            return (
                              Number(value) > 0 &&
                              Number(value) <= delegationShare
                            );
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            className="bg-[#FFFFFF0D] rounded-2xl"
                            {...field}
                            required
                            fullWidth
                            size="small"
                            type="number"
                            placeholder="Enter Amount here"
                            sx={textFieldStyles}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  {currency.coinDenom}
                                </InputAdornment>
                              ),
                              sx: textFieldInputPropStyles,
                            }}
                            error={!!errors.amount}
                          />
                        )}
                      />
                      {!!errors.amount ? (
                        <div className="flex justify-end mt-2">
                          <span className="errors-chip">
                            {errors.amount?.type === 'validate'
                              ? INSUFFICIENT_BALANCE
                              : errors.amount?.message}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-10 flex gap-10 items-center">
                    <button type="submit" className="dialog-delegate-button">
                      {loading === 'pending' ? 'Loading...' : 'Redelegate'}
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

export default DialogRedelegate;
