import { TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import { customTransferTextFieldStyles } from '../../styles';

/* eslint-disable @typescript-eslint/no-explicit-any */
const AddressField = ({
  control,
  checkIfIBCTransaction,
}: {
  control: any;
  checkIfIBCTransaction: (asset?: ParsedAsset | null) => void;
}) => {
  return (
    <Controller
      name="address"
      control={control}
      rules={{}}
      render={({ field }) => (
        <TextField
          className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
          {...field}
          placeholder="Address"
          required
          fullWidth
          type="text"
          sx={{
            ...customTransferTextFieldStyles,
            '& .MuiOutlinedInput-root': {
              ...customTransferTextFieldStyles['& .MuiOutlinedInput-root'],
              paddingLeft: '2px',
            },
          }}
          onBlur={() => {
            checkIfIBCTransaction?.();
          }}
        />
      )}
    />
  );
};

export default AddressField;
