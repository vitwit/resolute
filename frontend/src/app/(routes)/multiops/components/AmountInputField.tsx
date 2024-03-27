import { INSUFFICIENT_BALANCE } from '@/utils/errors';
import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { textFieldInputPropStyles, textFieldStyles } from '../styles';

interface AmountInputFieldProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
  availableBalance: number;
  displayDenom: string;
  setValue: any;
  feeAmount: number;
}

const AmountInputField = (props: AmountInputFieldProps) => {
  const { availableBalance, control, displayDenom, feeAmount, setValue } =
    props;
  return (
    <Controller
      name="amount"
      control={control}
      rules={{
        required: 'Amount is required',
        validate: (value) => {
          const amount = Number(value);
          if (isNaN(amount) || amount <= 0) return 'Invalid Amount';
          if (amount > availableBalance) return INSUFFICIENT_BALANCE;
        },
      }}
      render={({ field }) => (
        <TextField
          className="bg-[#FFFFFF0D] rounded-lg"
          {...field}
          required
          fullWidth
          type="number"
          size="small"
          placeholder="Enter Amount Here"
          sx={textFieldStyles}
          InputProps={{
            endAdornment: (
              <div className="flex p-2 items-center gap-6">
                <div className="flex gap-6">
                  <button
                    type="button"
                    className="amount-options px-4 py-2 amount-options-default"
                    onClick={() => {
                      const amount = availableBalance;
                      let halfAmount =
                        Math.max(0, (amount || 0) - feeAmount) / 2;
                      halfAmount = +halfAmount.toFixed(6);
                      setValue('amount', halfAmount.toString());
                    }}
                  >
                    Half
                  </button>
                  <button
                    type="button"
                    className="amount-options px-4 py-2 amount-options-default"
                    onClick={() => {
                      const amount = availableBalance;
                      let maxAmount = Math.max(0, (amount || 0) - feeAmount);
                      maxAmount = +maxAmount.toFixed(6);
                      setValue('amount', maxAmount.toString());
                    }}
                  >
                    Max
                  </button>
                </div>
                <InputAdornment position="start" className="w-[30px]">
                  {displayDenom}
                </InputAdornment>
              </div>
            ),
            sx: textFieldInputPropStyles,
          }}
        />
      )}
    />
  );
};

export default AmountInputField;
