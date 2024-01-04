import { INSUFFICIENT_BALANCE } from '@/utils/errors';
import { InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
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
  setValue: any;
  feeAmount: number;
}

const AmountInputField: React.FC<AmountInputField> = (props) => {
  const {
    availableAmount,
    control,
    displayDenom,
    errors,
    setValue,
    feeAmount,
  } = props;
  const [amountOption, setAmountOption] = useState('');

  return (
    <>
      <Controller
        name="amount"
        control={control}
        rules={{
          required: 'Amount is required',
          validate: (value) => {
            const amount = Number(value);
            if (isNaN(amount) || amount <= 0) return 'Invalid Amount';
            if (amount > availableAmount) return INSUFFICIENT_BALANCE;
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
            placeholder="Enter Amount Here"
            sx={textFieldStyles}
            InputProps={{
              endAdornment: (
                <div className="flex p-2 items-center gap-6">
                  <div className="flex gap-6">
                    <button
                      type="button"
                      className={
                        'amount-options px-6 py-2 ' +
                        (amountOption === 'half'
                          ? 'amount-options-fill'
                          : 'amount-options-default')
                      }
                      onClick={() => {
                        setAmountOption('half');
                        const amount = availableAmount;
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
                      className={
                        `amount-options px-6 py-2 ` +
                        (amountOption === 'max'
                          ? 'amount-options-fill'
                          : 'amount-options-default')
                      }
                      onClick={() => {
                        setAmountOption('max');
                        const amount = availableAmount;
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
      <div className="error-box">
        <span
          className={
            !!errors.amount ? 'error-chip opacity-80' : 'error-chip opacity-0'
          }
        >
          {errors.amount?.message}
        </span>
      </div>
    </>
  );
};

export default AmountInputField;
