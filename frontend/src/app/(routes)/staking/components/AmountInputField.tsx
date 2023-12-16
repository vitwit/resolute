import { INSUFFICIENT_BALANCE } from '@/utils/errors';
import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { textFieldInputPropStyles, textFieldStyles } from '../styles';

interface AmountInputField {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
  availableAmount: number;
  displayDenom: string;
  errors: FieldErrors<{
    amount: number;
  }>;
}

const AmountInputField: React.FC<AmountInputField> = (props) => {
  const { availableAmount, control, displayDenom, errors } = props;
  return (
    <>
      <Controller
        name="amount"
        control={control}
        rules={{
          required: 'Amount is required',
          validate: (value) => {
            return Number(value) > 0 && Number(value) <= availableAmount;
          },
        }}
        render={({ field }) => (
          <TextField
            className="bg-[#FFFFFF0D] rounded-2xl"
            {...field}
            required
            fullWidth
            type="number"
            size="small"
            autoFocus={true}
            placeholder="Enter Amount here"
            sx={textFieldStyles}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">{displayDenom}</InputAdornment>
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
    </>
  );
};

export default AmountInputField;
