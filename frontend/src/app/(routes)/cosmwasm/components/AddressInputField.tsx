import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { customTextFieldStyles } from '../styles';
import Image from 'next/image';

interface AddressInputFieldI {
  address: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => void;
  onDelete: (index: number) => void;
  index: number;
}

const AddressInputField = (props: AddressInputFieldI) => {
  const { address, handleChange, onDelete, index } = props;
  return (
    <TextField
      name="sourceAmount"
      className="rounded-lg bg-[#ffffff0D]"
      fullWidth
      required={false}
      size="small"
      autoFocus={true}
      placeholder="Enter Address"
      sx={customTextFieldStyles}
      value={address}
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
            {index === 0 ? null : (
              <div
                className="cursor-pointer"
                onClick={() => {
                  onDelete(index);
                }}
              >
                <Image src="/delete-icon.svg" width={24} height={24} alt="" />
              </div>
            )}
          </InputAdornment>
        ),
      }}
      onChange={(e) => handleChange(e, index)}
    />
  );
};

export default AddressInputField;
