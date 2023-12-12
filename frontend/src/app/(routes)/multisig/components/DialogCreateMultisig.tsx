import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  InputAdornment,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { setError } from '@/store/features/common/commonSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { deepPurple } from '@mui/material/colors';
import Axios from 'axios';
import { cleanURL } from '@/utils/util';
import {
  generateMultisigAccount,
  isValidPubKey,
} from '@/txns/multisig/multisig';
import { getAuthToken } from '@/utils/localStorage';
import { createAccount } from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';

interface DialogCreateMultisigProps {
  open: boolean;
  onClose: () => void;
  addressPrefix: string;
  chainID: string;
  address: string;
  pubKey: string;
  baseURL: string;
}

interface InputTextComponentProps {
  index: number;
  field: PubKeyFields;
  handleRemoveValue: (index: number) => void;
  handleChangeValue: (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
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
}: InputTextComponentProps) => {
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
      <div className="text-[14px] text-[#E57575]">
        {field.error.length ? field.error : ''}
      </div>
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

  const createMultiAccRes = useAppSelector(
    (state: RootState) => state.multisig.createMultisigAccountRes
  );

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

  const togglePubKey = (index: number) => {
    const pubKeysList = [...pubKeyFields];
    pubKeysList[index].isPubKey = !pubKeysList[index].isPubKey;
    pubKeysList[index].error = '';
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(index, e.target.name, e.target.value);
    const newInputFields = pubKeyFields.map((value, key) => {
      if (e.target.name === 'address') {
        if (index === key) {
          value['address'] = e.target.value;
          value['value'] = e.target.value;
        }
        return value;
      } else {
        if (index === key) {
          value['pubKey'] = e.target.value;
          value['value'] = e.target.value;
        }
        return value;
      }
    });
    console.log(newInputFields);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) > pubKeyFields?.length) {
      alert('Threshold can not be greater than pubkeys');
      return;
    }
    setThreshold(parseInt(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    console.log(pubKeyFields);

    if (Number(threshold) < 1) {
      dispatch(
        setError({ type: 'error', message: 'Threshold must be greater than 1' })
      );
      return;
    }

    const pubKeys = pubKeyFields.map((v) => v.value);

    if (!pubKeys?.length) {
      dispatch(
        setError({ type: 'error', message: 'At least 1 pubkey is required' })
      );
      return;
    }

    let isValid = true;
    pubKeyFields.forEach(async (field, index) => {
      if (!field.isPubKey) {
        const pubKey = await getPubkey(field.address, baseURL);
        const pubKeysList = [...pubKeyFields];
        if (!pubKeysList[index].isPubKey) {
          if (pubKey.length) {
            setPubKeyFields((pubKeyFields) => {
              const pubKeysList2 = [...pubKeyFields];
              pubKeysList2[index].pubKey = pubKey;
              pubKeysList2[index].error = '';
              return pubKeysList2;
            });
          } else {
            isValid = false;
            pubKeysList[index].error =
              'Address not found on chain, please enter pubKey';
            setPubKeyFields((pubKeyFields) => {
              const pubKeysList2 = [...pubKeyFields];
              pubKeysList2[index].pubKey = pubKey;
              pubKeysList2[index].error =
                'Address not found on chain, please enter pubKey';
              return pubKeysList2;
            });
          }
        }
      } else if (field.pubKey.length) {
        const pubKeysList = [...pubKeyFields];
        if (!isValidPubKey(field.pubKey)) {
          isValid = false;
          pubKeysList[index].error = 'Invalid pubKey';
          setPubKeyFields((pubKeyFields) => {
            const pubKeysList2 = [...pubKeyFields];
            pubKeysList2[index].pubKey = pubKeysList[index].pubKey;
            pubKeysList2[index].error = pubKeysList[index].error;
            return pubKeysList2;
          });
        } else {
          pubKeysList[index].error = '';
          setPubKeyFields((pubKeyFields) => {
            const pubKeysList2 = [...pubKeyFields];
            pubKeysList2[index].pubKey = pubKeysList[index].pubKey;
            pubKeysList2[index].error = pubKeysList[index].error;
            return pubKeysList2;
          });
        }
      }
    });

    if (!isValid) {
      return;
    }

    const uniquePubKeys = Array.from(new Set(pubKeys));
    if (uniquePubKeys?.length !== pubKeys?.length) {
      dispatch(
        setError({
          type: 'error',
          message: 'You have entered duplicate pubkeys',
        })
      );
      return;
    }

    for (let i = 0; i < uniquePubKeys.length; i++) {
      if (!isValidPubKey(uniquePubKeys[i])) {
        setFormError(`pubKey at ${i + 1} is invalid`);
        return;
      }
    }

    try {
      const res = generateMultisigAccount(
        pubKeys,
        Number(threshold),
        addressPrefix
      );
      const authToken = getAuthToken(chainID);
      const queryParams = {
        address: address,
        signature: authToken?.signature || '',
      };
      dispatch(
        createAccount({
          queryParams: queryParams,
          data: {
            address: res.address,
            chainId: chainID,
            pubkeys: res.pubkeys,
            createdBy: address,
            name: name,
            threshold: res.threshold,
          },
        })
      );
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      dispatch(setError({ type: 'error', message: error }));
    }
  };

  useEffect(() => {
    if (createMultiAccRes?.status === 'idle') {
      dispatch(setError({ type: 'success', message: 'Successfully created' }));
    } else if (createMultiAccRes?.status === 'rejected') {
      dispatch(setError({ type: 'error', message: createMultiAccRes?.error }));
    }
  }, [createMultiAccRes]);

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
              <form onSubmit={(e) => handleSubmit(e)}>
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
                    />
                    <div className="text-right font-light">
                      {index !== 0 ? (
                        <button
                          onClick={() => {
                            togglePubKey(index);
                          }}
                          type="button"
                          className="text-[12px] underline underline-offset-2"
                        >
                          {field.isPubKey ? 'Use Address' : 'Use PubKey'}
                        </button>
                      ) : null}
                    </div>
                  </>
                ))}
                <div className="text-center text-[12px] font-light">
                  <span
                    className="border-b cursor-pointer"
                    onClick={handleAddPubKey}
                  >
                    Add New Member
                  </span>
                </div>
                <div className="my-6 flex items-center gap-4">
                  <TextField
                    className="bg-[#FFFFFF0D] rounded-[4px]"
                    name={'threshold'}
                    defaultValue={0}
                    value={threshold}
                    required
                    inputProps={{ maxLength: 1 }}
                    onChange={handleChange}
                    label=""
                    type="number"
                    size="small"
                    style={{ maxWidth: 75 }}
                    sx={textFieldStyles}
                    InputProps={{
                      sx: {
                        input: {
                          color: 'white',
                          fontSize: '14px',
                        },
                      },
                    }}
                  />
                  <div className="font-extralight text-[14px] text-[#FFFFFF80]">
                    of
                  </div>
                  <TextField
                    className="bg-[#FFFFFF0D] rounded-[4px]"
                    name={'threshold'}
                    value={pubKeyFields?.length}
                    label=""
                    disabled
                    size="small"
                    style={{ maxWidth: 75 }}
                    sx={textFieldStyles}
                    InputProps={{
                      sx: {
                        input: {
                          color: 'white',
                          fontSize: '14px',
                        },
                      },
                    }}
                  />
                  <div className="font-extralight text-[14px]">Threshold</div>
                </div>
                <div>{formError}</div>
                <Button
                  disabled={createMultiAccRes?.status === 'pending'}
                  sx={{
                    width: '144px',
                    color: 'white',
                    fontWeight: 500,
                    textTransform: 'none',
                  }}
                  className="create-account-btn"
                  type="submit"
                >
                  {createMultiAccRes?.status === 'pending' ? (
                    <CircularProgress size={25} />
                  ) : (
                    'Create'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateMultisig;
