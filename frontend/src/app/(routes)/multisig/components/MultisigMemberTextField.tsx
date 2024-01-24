import { InputTextComponentProps } from '@/types/multisig';
import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { createMultisigTextFieldStyles } from '../styles';
import Image from 'next/image';

const MultisigMemberTextField: React.FC<InputTextComponentProps> = (props) => {
  const { field, index, handleChangeValue, handleRemoveValue } = props;
  return (
    <>
      <TextField
        className="bg-[#FFFFFF0D] rounded-2xl"
        onChange={(e) => handleChangeValue(index, e)}
        name={field.isPubKey ? 'pubKey' : 'address'}
        value={field.isPubKey ? field.pubKey : field.address}
        required={field?.required}
        placeholder={field.isPubKey ? 'Public Key (Secp256k1)' : 'Address'}
        sx={createMultisigTextFieldStyles}
        fullWidth
        disabled={field.disabled}
        InputProps={{
          endAdornment: !field.disabled ? (
            <InputAdornment
              onClick={() =>
                !field.disabled
                  ? handleRemoveValue(index)
                  : alert('Cannot self remove')
              }
              position="end"
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
            >
              <Image
                src="/delete-icon-outlined.svg"
                height={24}
                width={24}
                alt="Delete"
                draggable={false}
              />
            </InputAdornment>
          ) : index === 0 ? (
            <InputAdornment position="end">
              <div>(You)</div>
            </InputAdornment>
          ) : null,
          sx: {
            input: {
              color: 'white',
              fontSize: '14px',
              padding: 2,
            },
          },
        }}
      />
      <div className="address-pubkey-field-error">
        {field.error.length ? field.error : ''}
      </div>
    </>
  );
};

export default MultisigMemberTextField;
