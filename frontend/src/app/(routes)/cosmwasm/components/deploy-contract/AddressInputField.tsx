import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import { customTextFieldStyles } from '@/utils/commonStyles';
import { MINUS_ICON_DISABLED } from '@/constants/image-names';

interface AddressInputFieldI {
  address: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => void;
  onDelete: (index: number) => void;
  index: number;
  disableDelete: boolean;
}

const AddressInputField = (props: AddressInputFieldI) => {
  const { address, handleChange, onDelete, index, disableDelete } = props;
  return (
    <TextField
      name="sourceAmount"
      className="rounded-lg"
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
            {disableDelete ? null : (
              <div
                className="cursor-pointer"
                onClick={() => {
                  onDelete(index);
                }}
              >
                <Image
                  src={MINUS_ICON_DISABLED}
                  width={24}
                  height={24}
                  alt=""
                />
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
