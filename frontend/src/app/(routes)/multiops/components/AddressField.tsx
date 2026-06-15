import { TextField } from '@mui/material';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { sendTxnTextFieldStyles } from '../styles';

const AddressField = ({
  control,
  name,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  control: Control<any, any>;
  name: string;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          className="bg-[#FFFFFF0D]"
          {...field}
          sx={sendTxnTextFieldStyles}
          placeholder="From"
          disabled
          fullWidth
          InputProps={{
            sx: {
              input: {
                color: 'white !important',
                fontSize: '14px',
                padding: 2,
              },
            },
          }}
        />
      )}
    />
  );
};

export default AddressField;
