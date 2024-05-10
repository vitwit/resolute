import { TextField } from '@mui/material';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { customTextFieldStyles } from '../styles';

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTextField = ({
  control,
  name,
  placeHolder,
  rules,
  required,
}: {
  control: Control<any, any>;
  rules?: any;
  name: string;
  placeHolder: string;
  required: boolean;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          className="rounded-lg bg-[#ffffff0D]"
          {...field}
          required={required}
          fullWidth
          placeholder={placeHolder}
          sx={customTextFieldStyles}
        />
      )}
    />
  );
};

export default CustomTextField;
