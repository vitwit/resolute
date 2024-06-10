import React from 'react';
import { Controller } from 'react-hook-form';

/* eslint-disable @typescript-eslint/no-explicit-any */
const AmountInputField = ({ control }: { control: any }) => {
  return (
    <Controller
      name="amount"
      control={control}
      rules={{}}
      render={({ field }) => (
        <input
          className="amount-input-field"
          {...field}
          placeholder="0"
          required
        />
      )}
    />
  );
};

export default AmountInputField;
