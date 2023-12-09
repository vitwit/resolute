import { TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTextField = ({
  name,
  rules,
  control,
  error,
  textFieldClassName,
  textFieldSize,
  placeHolder,
  textFieldCustomMuiSx,
  inputProps,
  required,
}: {
  name: string;
  rules: any;
  control: any;
  error: boolean;
  textFieldClassName: string;
  textFieldSize: any;
  placeHolder: string;
  textFieldCustomMuiSx: any;
  inputProps: any;
  required: boolean;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          className={textFieldClassName}
          {...field}
          fullWidth
          required={required}
          size={textFieldSize}
          placeholder={placeHolder}
          sx={textFieldCustomMuiSx}
          InputProps={inputProps}
          error={error}
        />
      )}
    />
  );
};

export default CustomTextField;

export const CustomMultiLineTextField = ({
  name,
  rules,
  control,
  error,
  textFieldClassName,
  textFieldSize,
  placeHolder,
  textFieldCustomMuiSx,
  inputProps,
  required,
  rows,
}: {
  name: string;
  rules: any;
  control: any;
  error: boolean;
  textFieldClassName: string;
  textFieldSize: any;
  placeHolder: string;
  textFieldCustomMuiSx: any;
  inputProps: any;
  required: boolean;
  rows: number;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          multiline
          className={textFieldClassName}
          {...field}
          fullWidth
          rows={rows}
          required={required}
          size={textFieldSize}
          placeholder={placeHolder}
          sx={textFieldCustomMuiSx}
          InputProps={inputProps}
          error={error}
        />
      )}
    />
  );
};
