import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { customTextFieldStyles } from '../styles';
import Image from 'next/image';

interface AmountInputFieldI {
  amount: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => void;
  onDelete: () => void;
  index: number;
}

const AmountInputField = (props: AmountInputFieldI) => {
  const { amount, handleChange, onDelete, index } = props;
  return (
    <TextField
      name="sourceAmount"
      className="rounded-lg bg-[#ffffff0D]"
      fullWidth
      required={false}
      size="small"
      autoFocus={true}
      placeholder="Enter Amount"
      sx={customTextFieldStyles}
      value={amount}
      InputProps={{
        sx: {
          input: {
            color: 'white !important',
            fontSize: '14px',
            padding: 2,
          },
        },
        endAdornment: (
          <InputAdornment position="start">
            <div className="cursor-pointer" onClick={onDelete}>
              <Image src="/delete-icon.svg" width={24} height={24} alt="" />
            </div>
          </InputAdornment>
        ),
      }}
      onChange={(e) => handleChange(e, index)}
    />
  );
};

export default AmountInputField;
