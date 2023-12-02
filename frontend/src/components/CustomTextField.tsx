import { TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

 /* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTextField = ({
  name,
  rules,
  control,
  error,
  textFieldStyle,
  textFieldSize,
  placeHolder,
  textFeildCustomMuiSx,
  inputProps,
  required,
}: {
  name: string;
  rules: any;
  control: any;
  error: boolean;
  textFieldStyle: string;
  textFieldSize: any;
  placeHolder: string;
  textFeildCustomMuiSx: any;
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
          className={textFieldStyle}
          {...field}
          fullWidth
          required={required}
          size={textFieldSize}
          placeholder={placeHolder}
          sx={textFeildCustomMuiSx}
          InputProps={inputProps}
          error={error}
        />
      )}
    />
  );
};

export default CustomTextField;
