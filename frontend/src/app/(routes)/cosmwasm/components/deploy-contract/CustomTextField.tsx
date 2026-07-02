import { TextField } from '@mui/material';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { customTextFieldStyles } from '@/utils/commonStyles';

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
          className="bg-transparent rounded-full border-[1px] border-[#ffffff80]"
          {...field}
          required={required}
          fullWidth
          placeholder={placeHolder}
          sx={{
            ...customTextFieldStyles,
            '& .MuiOutlinedInput-root': {
              border: '0.25px solid #ffffff10',
              borderRadius: '100px',
              height: '32px',
            },
            '& .MuiInputBase-input': {
              paddingY: '0px',
              color: '#fffffff0',
              fontSize: '14px',
              fontWeight: 200,
              fontFamily: 'Libre Franklin',
              lineHeight: '21px',
            },
          }}
        />
      )}
    />
  );
};

export default CustomTextField;
