import { TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import { customTransferTextFieldStyles } from '../../styles';

/* eslint-disable @typescript-eslint/no-explicit-any */
const MemoField = ({ control }: { control: any }) => {
  return (
    <Controller
      name="memo"
      control={control}
      rules={{}}
      render={({ field }) => (
        <TextField
          className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
          {...field}
          fullWidth
          type="text"
          sx={customTransferTextFieldStyles}
        />
      )}
    />
  );
};

export default MemoField;
