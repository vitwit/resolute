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
    amount: string;
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
            const amount = Number(value);
            if(isNaN(amount) || amount <= 0) return "Invalid Amount";
            if(amount > availableAmount) return INSUFFICIENT_BALANCE;
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
          />
        )}
      />
        <div className="error-box">
          <span className={!!errors.amount ? "error-chip opacity-80" : "error-chip opacity-0"}>
            {errors.amount?.message}
          </span>
        </div>
    </>
  );
};

export default AmountInputField;
