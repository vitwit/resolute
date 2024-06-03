import { InputTextComponentProps } from '@/types/multisig';
import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { createMultisigTextFieldStyles } from '../styles';
import Image from 'next/image';
import { REMOVE_ICON, TOGGLE_OFF, TOGGLE_ON } from '@/constants/image-names';

const MultisigMemberTextField: React.FC<InputTextComponentProps> = (props) => {
  const {
    field,
    index,
    handleChangeValue,
    handleRemoveValue,
    togglePubKey,
    isImport,
  } = props;
  return (
    <div>
      <TextField
        className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
        onChange={(e) => handleChangeValue(index, e)}
        name={field.isPubKey ? 'pubKey' : 'address'}
        value={
          index === 0
            ? field.address
            : field.isPubKey
              ? field.pubKey
              : field.address
        }
        required={field?.required}
        placeholder={field.isPubKey ? 'Public Key (Secp256k1)' : 'Address'}
        sx={createMultisigTextFieldStyles}
        fullWidth
        disabled={field.disabled}
        InputProps={{
          endAdornment:
            !field.disabled && !isImport ? (
              <InputAdornment
                position="end"
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                  minWidth: '95px', // Adjust the minimum width here
                }}
              >
                <div
                  className="flex items-center gap-4"
                  style={{ minWidth: '95px' }}
                >
                  <TogglePubkey
                    toggle={() => togglePubKey(index)}
                    isPubKey={field.isPubKey}
                  />
                  <RemoveButton
                    onClick={() =>
                      !field.disabled
                        ? handleRemoveValue(index)
                        : alert('Cannot self remove')
                    }
                  />
                </div>
              </InputAdornment>
            ) : index === 0 ? (
              <InputAdornment position="end">
                <div className="text-small-light">(You)</div>
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
    </div>
  );
};

export default MultisigMemberTextField;

const TogglePubkey = ({
  toggle,
  isPubKey,
}: {
  toggle: () => void;
  isPubKey: boolean;
}) => {
  return (
    <button className="flex items-center gap-1" type="button" onClick={toggle}>
      <Image
        src={isPubKey ? TOGGLE_ON : TOGGLE_OFF}
        height={11.2}
        width={16}
        alt=""
      />
      <span className="text-[12px] font-light text-white">pubkey</span>
    </button>
  );
};

const RemoveButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button type="button" onClick={onClick}>
      <Image
        src={REMOVE_ICON}
        height={24}
        width={24}
        alt="Remove"
        draggable={false}
      />
    </button>
  );
};
