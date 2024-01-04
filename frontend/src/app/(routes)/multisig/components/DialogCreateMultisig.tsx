import {
  CircularProgress,
  Dialog,
  DialogContent,
  InputAdornment,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { setError } from '@/store/features/common/commonSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import Axios from 'axios';
import { cleanURL } from '@/utils/util';
import {
  generateMultisigAccount,
  isValidPubKey,
} from '@/txns/multisig/multisig';
import { getAuthToken } from '@/utils/localStorage';
import { createAccount } from '@/store/features/multisig/multisigSlice';
import { RootState } from '@/store/store';
import {
  createMultisigTextFieldStyles,
  createMultisigThresholdStyles,
} from '../styles';
import {
  ADDRESS_NOT_FOUND,
  DUPLICATE_PUBKEYS_ERROR,
  FAILED_TO_GENERATE_MULTISIG,
  INVALID_PUBKEY,
  MAX_PUBKEYS_ERROR,
  MAX_THRESHOLD_ERROR,
  MIN_PUBKEYS_ERROR,
  MIN_THRESHOLD_ERROR,
} from '@/utils/errors';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';

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

const MAX_PUB_KEYS = 7;

const InputTextComponent: React.FC<InputTextComponentProps> = (props) => {
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
          endAdornment:
            index !== 0 ? (
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
            ) : (
              <InputAdornment position="end">
                <div>(You)</div>
              </InputAdornment>
            ),
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
    console.log(error);
    return '';
  }
};

const DialogCreateMultisig: React.FC<DialogCreateMultisigProps> = (props) => {
  const { open, onClose, address, addressPrefix, chainID, pubKey, baseURL } =
    props;
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
  }, [pubKey]);

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

    setPubKeyFields(newInputFields);
  };

  const handleAddPubKey = () => {
    if (pubKeyFields?.length >= MAX_PUB_KEYS) {
      dispatch(
        setError({
          type: 'error',
          message: MAX_PUBKEYS_ERROR,
        })
      );
      return;
    } else {
      setPubKeyFields([...pubKeyFields, pubKeyObj]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) > pubKeyFields?.length) {
      alert(MAX_THRESHOLD_ERROR);
      return;
    }
    setThreshold(parseInt(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    if (Number(threshold) < 1) {
      dispatch(setError({ type: 'error', message: MIN_THRESHOLD_ERROR }));
      return;
    }

    if (!pubKeyFields?.length) {
      dispatch(setError({ type: 'error', message: MIN_PUBKEYS_ERROR }));
      return;
    }

    let isValid = true;
    const pubKeyValidationPromises = pubKeyFields.map(async (field, index) => {
      if (!field.isPubKey) {
        const pubKey = await getPubkey(field.address, baseURL);
        if (pubKey.length) {
          return { index, pubKey, error: '' };
        } else {
          isValid = false;
          return { index, pubKey: '', error: ADDRESS_NOT_FOUND };
        }
      } else if (field.pubKey.length) {
        if (!isValidPubKey(field.pubKey)) {
          isValid = false;
          return { index, pubKey: field.pubKey, error: INVALID_PUBKEY };
        } else {
          return { index, pubKey: field.pubKey, error: '' };
        }
      }
      return { index, pubKey: '', error: '' };
    });

    const results = await Promise.all(pubKeyValidationPromises);
    results.forEach((result) => {
      const pubKeysList = [...pubKeyFields];
      pubKeysList[result.index].pubKey = result.pubKey;
      pubKeysList[result.index].error = result.error;
      setPubKeyFields(pubKeysList);
    });

    if (!isValid) {
      return;
    }

    const pubKeys = pubKeyFields.map((v) => v.pubKey);

    const uniquePubKeys = Array.from(new Set(pubKeys));
    if (uniquePubKeys?.length !== pubKeys?.length) {
      dispatch(
        setError({
          type: 'error',
          message: DUPLICATE_PUBKEYS_ERROR,
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
      dispatch(
        setError({
          type: 'error',
          message: error || FAILED_TO_GENERATE_MULTISIG,
        })
      );
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
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ p: 0 }} className="text-white w-[890px]">
        <div className="w-[890px] pb-12 text-white">
          <div className="px-10 pb-6 pt-10 flex justify-end">
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
                draggable={false}
              />
            </div>
          </div>
          <div className="flex gap-10 items-center">
            <div className="flex-1 flex flex-col px-10">
              <h2 className="text-[20px] font-bold leading-[21px]">
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
                  sx={createMultisigTextFieldStyles}
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
                <div className="text-right mt-4 text-[12px] font-light">
                  <button
                    type="button"
                    className="create-multisig-btn cursor-pointer"
                    onClick={handleAddPubKey}
                  >
                    Add New Member
                  </button>
                </div>
                <div className="mb-6 flex items-center gap-4">
                  <TextField
                    className="bg-[#FFFFFF0D] rounded-[4px]"
                    name={'threshold'}
                    value={threshold}
                    required
                    inputProps={{ maxLength: 1 }}
                    onChange={handleChange}
                    label=""
                    type="number"
                    size="small"
                    style={{ maxWidth: 75 }}
                    sx={{
                      ...createMultisigTextFieldStyles,
                      ...createMultisigThresholdStyles,
                    }}
                    InputProps={{
                      sx: {
                        input: {
                          color: 'white',
                          fontSize: '14px',
                        },
                      },
                    }}
                  />
                  <div className="font-extralight text-[14px] mt-6 text-[#FFFFFF80]">
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
                    sx={createMultisigTextFieldStyles}
                    InputProps={{
                      sx: {
                        input: {
                          color: 'white',
                          fontSize: '14px',
                        },
                      },
                    }}
                  />
                  <div className="font-extralight text-[14px] mt-6">
                    Threshold
                  </div>
                </div>
                <div>{formError}</div>
                <button
                  disabled={createMultiAccRes?.status === 'pending'}
                  className="create-account-btn min-w-[144px]"
                  type="submit"
                >
                  {createMultiAccRes?.status === 'pending' ? (
                    <CircularProgress size={16} sx={{ color: 'white' }} />
                  ) : (
                    'Create'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateMultisig;
