import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import { customTextFieldStyles } from '@/utils/commonStyles';
import { MINUS_ICON_DISABLED } from '@/constants/image-names';

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
      className="rounded-lg"
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
          },
        },
        endAdornment: (
          <InputAdornment position="start">
            <div className="cursor-pointer" onClick={onDelete}>
              <Image src={MINUS_ICON_DISABLED} width={24} height={24} alt="" />
            </div>
          </InputAdornment>
        ),
      }}
      onChange={(e) => handleChange(e, index)}
    />
  );
};

export default AmountInputField;
