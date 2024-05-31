import { TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import { customTextFieldStyles } from '../../styles';

/* eslint-disable @typescript-eslint/no-explicit-any */
const AddressField = ({ control }: { control: any }) => {
  return (
    <Controller
      name="address"
      control={control}
      rules={{}}
      render={({ field }) => (
        <TextField
          className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
          {...field}
          required
          fullWidth
          type="text"
          autoFocus={true}
          sx={customTextFieldStyles}
        />
      )}
    />
  );
};

export default AddressField;
