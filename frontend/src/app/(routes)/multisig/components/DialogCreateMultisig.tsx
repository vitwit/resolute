import {
  Dialog,
  DialogContent,
  InputAdornment,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { setError } from '@/store/features/common/commonSlice';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { deepPurple } from '@mui/material/colors';
import Axios from 'axios';
import authService from '@/store/features/auth/authService';
import { cleanURL } from '@/utils/util';

interface DialogCreateMultisigProps {
  open: boolean;
  onClose: () => void;
  addressPrefix: string;
  chainID: string;
  address: string;
  pubKey: string;
  baseURL: string;
}

interface PubKeyFields {
  name: string;
  value: string;
  label: string;
  placeHolder: string;
  required: boolean;
  disabled: boolean;
  pubKey: string;
  address: string;
  isPubKey: boolean;
  error: string;
}

const textFieldStyles = {
  my: 1,
  '& .MuiTypography-body1': {
    color: 'white',
    fontSize: '12px',
    fontWeight: 200,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .Mui-disabled': {
    '-webkit-text-fill-color': '#ffffff6b !important',
  },
  '& Mui-focused': {
    border: '2px solid red',
  },
};

const InputTextComponent = ({
  field,
  index,
  handleChangeValue,
  handleRemoveValue,
  handleBlur,
}: any) => {
  return (
    <>
      <TextField
        className="bg-[#FFFFFF0D] rounded-2xl"
        onChange={(e) => handleChangeValue(index, e)}
        name={field.isPubKey ? 'pubKey' : 'address'}
        value={field.isPubKey ? field.pubKey : field.address}
        required={field?.required}
        placeholder={field.isPubKey ? 'Public Key (Secp256k1)' : 'Address'}
        sx={textFieldStyles}
        fullWidth
        disabled={field.disabled}
        onBlur={(e) => handleBlur(index, e)}
        InputProps={{
          endAdornment:
            index !== 0 ? (
              <InputAdornment
                onClick={() =>
                  !field.disabled
                    ? handleRemoveValue(index)
                    : alert('cannot self remove')
                }
                position="end"
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              >
                <DeleteIcon sx={{ color: deepPurple[200] }} />
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
      <div>{field.error.length ? field.error : ''}</div>
    </>
  );
};

const getPubkey = async (address: string, baseURL: string) => {
  try {
    const { status, data } = await Axios.get(
      `${cleanURL(baseURL)}/cosmos/auth/v1beta1/accounts/${address}`
    );

    if (status === 200) {
      return data.account.pub_key.key || '';
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

const DialogCreateMultisig = ({
  open,
  onClose,
  address,
  addressPrefix,
  chainID,
  pubKey,
  baseURL,
}: DialogCreateMultisigProps) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [pubKeyFields, setPubKeyFields] = useState<PubKeyFields[]>([]);
  const [threshold, setThreshold] = useState(0);
  const [formError, setFormError] = useState('');

  const pubKeyObj = {
    name: 'pubKey',
    value: '',
    label: 'Public Key (Secp256k1)',
    placeHolder: 'E. g. AtgCrYjD+21d1+og3inzVEOGbCf5uhXnVeltFIo7RcRp',
    required: true,
    disabled: false,
    isPubKey: false,
    address: '',
    pubKey: '',
    error: '',
  };

  useEffect(() => {
    setPubKeyFields([
      {
        name: 'current',
        value: pubKey,
        label: 'Public Key (Secp256k1)',
        placeHolder: 'E. g. AtgCrYjD+21d1+og3inzVEOGbCf5uhXnVeltFIo7RcRp',
        required: true,
        disabled: true,
        pubKey: pubKey,
        address: '',
        isPubKey: true,
        error: '',
      },
      { ...pubKeyObj },
    ]);
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const usePubkey = (index: number) => {
    const pubKeysList = [...pubKeyFields];
    pubKeysList[index].isPubKey = !pubKeysList[index].isPubKey;
    setPubKeyFields(pubKeysList);
  };

  const handleRemoveValue = (i: number) => {
    if (pubKeyFields.length > 1) {
      pubKeyFields.splice(i, 1);
      setPubKeyFields([...pubKeyFields]);
    }
  };

  const handleChangeValue = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    console.log(index, e.target.name, e.target.value);
    const newInputFields = pubKeyFields.map((value, key) => {
      if (e.target.name === 'address') {
        if (index === key) {
          value['address'] = e.target.value;
        }
        return value;
      } else {
        if (index === key) {
          value['pubKey'] = e.target.value;
        }
        return value;
      }
    });

    setPubKeyFields(newInputFields);
  };

  const handleAddPubKey = () => {
    if (pubKeyFields?.length > 6) {
      dispatch(
        setError({
          type: 'error',
          message: "You can't add more than 7 pub keys",
        })
      );
      return;
    } else {
      setPubKeyFields([...pubKeyFields, pubKeyObj]);
    }
  };

  const handleBlur = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let pubKey;
    const pubKeysList = [...pubKeyFields];
    const address = e.target.value;
    if (!pubKeysList[index].isPubKey && address.length) {
      pubKey = await getPubkey(address, baseURL);
      if (pubKey.length) {
        pubKeysList[index].pubKey = pubKey;
        pubKeysList[index].error = '';
        setPubKeyFields((pubKeyFields) => {
          const pubKeysList2 = [...pubKeyFields];
          pubKeysList2[index].pubKey = pubKeysList[index].pubKey;
          pubKeysList2[index].error = pubKeysList[index].error;
          return pubKeysList2;
        });
      } else {
        pubKeysList[index].error =
          'Address not found on chain, please enter pubKey';
        setPubKeyFields((pubKeyFields) => {
          const pubKeysList2 = [...pubKeyFields];
          pubKeysList2[index].pubKey = pubKeysList[index].pubKey;
          pubKeysList2[index].error = pubKeysList[index].error;
          return pubKeysList2;
        });
      }
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(90deg, #704290 0.11%, #241b61 70.28%)',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }} className="text-white w-[890px]">
        <div className="w-[890px] pb-12 text-white">
          <div className="px-10 py-6 flex justify-end">
            <div
              onClick={() => {
                handleClose();
              }}
            >
              <Image
                className="cursor-pointer"
                src="/close-icon.svg"
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="flex gap-10 items-center">
            <Image
              src="/multisig-popup-image.png"
              width={336}
              height={298}
              alt="Create Multisig"
            />
            <div className="flex-1 flex flex-col gap-6 pr-10">
              <h2 className="text-[20px] font-bold leading-normal">
                Create Multisig
              </h2>
              <form>
                <TextField
                  className="bg-[#FFFFFF0D] rounded-2xl"
                  onChange={handleNameChange}
                  name="name"
                  value={name}
                  required
                  placeholder="Eg: Alice-Bob-Eve-Msig"
                  fullWidth
                  sx={textFieldStyles}
                  InputProps={{
                    sx: {
                      input: {
                        color: 'white',
                        fontSize: '14px',
                        padding: 2,
                      },
                    },
                  }}
                />
                {pubKeyFields.map((field, index) => (
                  <>
                    <InputTextComponent
                      key={index}
                      handleRemoveValue={handleRemoveValue}
                      handleChangeValue={handleChangeValue}
                      index={index}
                      field={field}
                      handleBlur={handleBlur}
                    />
                    <div className="">
                      {index !== 0 ? (
                        <button
                          onClick={() => {
                            usePubkey(index);
                            console.log(pubKeyFields);
                          }}
                          type="button"
                          className="text-[12px] underline"
                        >
                          {field.isPubKey ? 'Use Address' : 'Use PubKey'}
                        </button>
                      ) : null}
                    </div>
                  </>
                ))}
                <div className="text-right text-[12px] font-extralight">
                  <span
                    className="border-b cursor-pointer"
                    onClick={handleAddPubKey}
                  >
                    Add New Member
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateMultisig;
