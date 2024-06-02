import {
  CircularProgress,
  Dialog,
  DialogContent,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { setError } from '@/store/features/common/commonSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  generateMultisigAccount,
  isValidPubKey,
} from '@/txns/multisig/multisig';
import { getAuthToken } from '@/utils/localStorage';
import {
  createAccount,
  importMultisigAccount,
  resetMultisigAccountData,
} from '@/store/features/multisig/multisigSlice';
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
import {
  customMUITextFieldStyles,
  dialogBoxPaperPropStyles,
} from '@/utils/commonStyles';
import { TxStatus } from '@/types/enums';
import { fromBech32 } from '@cosmjs/encoding';
import { DialogCreateMultisigProps, PubKeyFields } from '@/types/multisig';
import MultisigMemberTextField from './MultisigMemberTextField';
import { COSMOS_CHAIN_ID, MULTISIG_PUBKEY_OBJECT } from '@/utils/constants';
import useGetPubkey from '@/custom-hooks/useGetPubkey';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useGetAccountInfo from '@/custom-hooks/useGetAccountInfo';
import CustomDialog from '@/components/common/CustomDialog';
import {
  ADD_ICON,
  MINUS_ICON,
  MINUS_ICON_DISABLED,
  PLUS_ICON,
  PLUS_ICON_DISABLED,
} from '@/constants/image-names';
import CustomButton from '@/components/common/CustomButton';

const MAX_PUB_KEYS = 7;
const MULTISIG_NAME_MAX_LENGTH = 100;
const INC = 'increase';
const DEC = 'decrease';

const DialogCreateMultisig: React.FC<DialogCreateMultisigProps> = (props) => {
  const { open, onClose, chainID } = props;
  const dispatch = useAppDispatch();
  const { getChainInfo } = useGetChainInfo();
  const {
    address,
    prefix: addressPrefix,
    restURLs: baseURLs,
  } = getChainInfo(chainID);
  const [accountInfo] = useGetAccountInfo(chainID);
  const { pubkey: pubKey } = accountInfo;
  const [name, setName] = useState('');
  const [pubKeyFields, setPubKeyFields] = useState<PubKeyFields[]>([]);
  const [threshold, setThreshold] = useState(1);
  const [formError, setFormError] = useState('');
  const [importMultisig, setImportMultisig] = useState(false);
  const [page, setPage] = useState(1);
  const [multisigAddress, setMultisigAddress] = useState('');
  const [addressValidationError, setAddressValidationError] = useState('');

  const { getPubkey, pubkeyLoading } = useGetPubkey();

  const createMultiAccRes = useAppSelector(
    (state: RootState) => state.multisig.createMultisigAccountRes
  );
  const importMultisigAccountRes = useAppSelector(
    (state: RootState) => state.multisig.multisigAccountData
  );

  const pubKeyObj = { ...MULTISIG_PUBKEY_OBJECT };

  useEffect(() => {
    setDefaultFormValues();
  }, [pubKey]);

  const setDefaultFormValues = () => {
    //By default current account is added
    setPubKeyFields([
      {
        name: 'current',
        value: pubKey,
        label: 'Public Key (Secp256k1)',
        placeHolder: 'E. g. AtgCrYjD+21d1+og3inzVEOGbCf5uhXnVeltFIo7RcRp',
        required: true,
        disabled: true,
        pubKey: pubKey,
        address: address,
        isPubKey: true,
        error: '',
      },
      { ...pubKeyObj },
    ]);
    setName('');
    setThreshold(1);
    setPage(1);
  };

  const handleClose = () => {
    resetCreateMultisig();
    onClose();
  };

  const resetCreateMultisig = () => {
    setMultisigAddress('');
    setAddressValidationError('');
    setDefaultFormValues();
    setImportMultisig(false);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > MULTISIG_NAME_MAX_LENGTH) {
      return;
    }
    setName(e.target.value);
  };

  const handleMultisigAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    validateMultisigAddress(e.target.value.trim());
    setMultisigAddress(e.target.value.trim());
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
        const pubKey = await getPubkey(field.address, baseURLs);
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
      const authToken = getAuthToken(COSMOS_CHAIN_ID);
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
      const message = importMultisig
        ? 'Successfully Imported'
        : ' Successfully Created';
      resetCreateMultisig();
      dispatch(setError({ type: 'success', message: message }));
    } else if (createMultiAccRes?.status === 'rejected') {
      dispatch(setError({ type: 'error', message: createMultiAccRes?.error }));
    }
  }, [createMultiAccRes]);

  const fetchMultisigAccount = () => {
    if (validateMultisigAddress(multisigAddress)) {
      dispatch(
        importMultisigAccount({
          accountAddress: address,
          multisigAddress: multisigAddress,
          baseURLs: baseURLs,
          addressPrefix: addressPrefix,
        })
      );
    }
  };

  const validateMultisigAddress = (address: string): boolean => {
    if (address.length) {
      try {
        fromBech32(address);
        setAddressValidationError('');
        return true;
      } catch (error) {
        setAddressValidationError('Invalid address');
        return false;
      }
    } else {
      setAddressValidationError('Please enter address');
      return false;
    }
  };

  const setMultisigAccountData = () => {
    const pubKeysList =
      importMultisigAccountRes.account?.account?.pub_key?.public_keys || [];
    const data: PubKeyFields[] = [];
    pubKeysList.forEach((pubkey: PubKey) => {
      data.push({
        name: 'pubKey',
        value: pubkey.key,
        label: 'Public Key (Secp256k1)',
        placeHolder: 'E. g. AtgCrYjD+21d1+og3inzVEOGbCf5uhXnVeltFIo7RcRp',
        required: true,
        disabled: true,
        isPubKey: true,
        address: '',
        pubKey: pubkey.key,
        error: '',
      });
    });
    setPubKeyFields(data);
    setThreshold(
      Number(importMultisigAccountRes.account?.account?.pub_key?.threshold || 0)
    );
  };

  const handleThresholdChange = (value: string) => {
    if (value === INC) {
      if (threshold + 1 > pubKeyFields?.length) {
        dispatch(setError({ type: 'error', message: MAX_THRESHOLD_ERROR }));
      } else {
        setThreshold(threshold + 1);
      }
    } else if (value === DEC) {
      if (threshold - 1 < 1) {
        dispatch(setError({ type: 'error', message: MIN_THRESHOLD_ERROR }));
      } else {
        setThreshold(threshold - 1);
      }
    }
  };

  useEffect(() => {
    if (importMultisigAccountRes.status === TxStatus.IDLE) {
      setImportMultisig(true);
      setPage(1);
      setMultisigAccountData();
    } else if (importMultisigAccountRes.status === TxStatus.REJECTED) {
      dispatch(
        setError({
          type: 'error',
          message: importMultisigAccountRes?.error,
        })
      );
    }
  }, [importMultisigAccountRes.status]);

  useEffect(() => {
    dispatch(resetMultisigAccountData());
  }, []);

  return (
    <CustomDialog
      open={open}
      title="Create Multisig"
      onClose={handleClose}
      styles="w-[800px]"
    >
      <div>
        {page === 1 ? (
          <div className="flex gap-10 items-center">
            <div className="flex-1 flex flex-col">
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="flex gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="text-b1-light !font-light">Name</div>
                    <TextField
                      className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                      onChange={handleNameChange}
                      name="name"
                      value={name}
                      required
                      autoFocus={true}
                      placeholder="Name (Eg: Alice-Bob-Eve-Msig)"
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
                  </div>
                  <div className="space-y-2">
                    <div className="text-b1-light !font-light">Threshold</div>
                    <Threshold
                      threshold={threshold}
                      handleThresholdChange={handleThresholdChange}
                      membersCount={pubKeyFields.length}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="text-b1-light !font-light">Add Members</div>
                    <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                      {pubKeyFields.map((field, index) => (
                        <div>
                          <MultisigMemberTextField
                            key={index}
                            handleRemoveValue={handleRemoveValue}
                            handleChangeValue={handleChangeValue}
                            index={index}
                            field={field}
                          />
                          {!importMultisig && (
                            <div className="text-right font-light">
                              {index !== 0 ? (
                                <button
                                  onClick={() => {
                                    togglePubKey(index);
                                  }}
                                  type="button"
                                  className="text-[12px] underline underline-offset-2"
                                >
                                  {field.isPubKey
                                    ? 'Use Address'
                                    : 'Use PubKey'}
                                </button>
                              ) : null}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {!importMultisig && (
                    <AddMemberButton handleAddPubKey={handleAddPubKey} />
                  )}
                </div>
                <div>{formError}</div>
                <div className="flex gap-4 items-center justify-end">
                  <CustomButton
                    btnText="Create"
                    btnDisabled={
                      createMultiAccRes?.status === 'pending' || pubkeyLoading
                    }
                    btnLoading={
                      createMultiAccRes?.status === 'pending' || pubkeyLoading
                    }
                    btnType="submit"
                  />
                  <div className="italic font-light">
                    {pubkeyLoading ? (
                      <div>
                        <span>Validating inputs</span>
                        <span className="dots-flashing"></span>
                      </div>
                    ) : createMultiAccRes?.status === 'pending' ? (
                      <div>
                        <span>Creating multisig account</span>
                        <span className="dots-flashing"></span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </form>
              {!importMultisig ? (
                <div className="create-multisig-dialog-footer">
                  <div className="text-[14px] font-extralight">Or</div>
                  <div className="flex gap-4 items-center">
                    <div className="text-[16px]">
                      Have an existing MultiSig account ?
                    </div>{' '}
                    <button
                      onClick={() => {
                        setMultisigAddress('');
                        setAddressValidationError('');
                        setName('');
                        setPage(2);
                      }}
                      className="text-only-btn"
                    >
                      Import Here
                    </button>
                  </div>
                </div>
              ) : (
                <div className="create-multisig-dialog-footer">
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={resetCreateMultisig}
                      className="text-only-btn opacity-50"
                    >
                      Cancel Import
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-10 items-center">
            <div className="flex-1 flex flex-col px-10">
              <h2 className="text-[20px] font-bold leading-[21px]">
                Import Multisig
              </h2>
              <div className="flex gap-6 my-6">
                <div className="flex-1 relative">
                  <TextField
                    className="bg-[#FFFFFF0D] rounded-2xl w-full"
                    name="granteeAddress"
                    value={multisigAddress}
                    onChange={handleMultisigAddressChange}
                    required
                    autoFocus={true}
                    placeholder="Enter Multisig Address Here"
                    InputProps={{
                      sx: {
                        input: {
                          color: 'white',
                          fontSize: '14px',
                          padding: 2,
                        },
                      },
                    }}
                    sx={customMUITextFieldStyles}
                  />
                  <div className="error-box absolute right-0">
                    <span
                      className={
                        addressValidationError
                          ? 'error-chip opacity-80'
                          : 'error-chip opacity-0'
                      }
                    >
                      {addressValidationError}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => fetchMultisigAccount()}
                  className="primary-gradient import-multisig-btn"
                >
                  {importMultisigAccountRes.status === TxStatus.PENDING ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    'Import Multisig'
                  )}
                </button>
              </div>
              <div className="create-multisig-dialog-footer">
                <div className="text-[14px] font-extralight">Or</div>
                <div className="flex gap-4 items-center">
                  <div className="text-[16px]">
                    Do not have an existing MultiSig account ?
                  </div>{' '}
                  <button
                    onClick={() => {
                      setImportMultisig(false);
                      setDefaultFormValues();
                    }}
                    className="text-only-btn"
                  >
                    Create New Here
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomDialog>
  );
};

export default DialogCreateMultisig;

const AddMemberButton = ({
  handleAddPubKey,
}: {
  handleAddPubKey: () => void;
}) => {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        className="flex items-center gap-2 font-light"
        onClick={handleAddPubKey}
      >
        <Image src={ADD_ICON} height={24} width={24} alt="" />
        <span>Add More</span>
      </button>
    </div>
  );
};

const Threshold = ({
  handleThresholdChange,
  threshold,
  membersCount,
}: {
  handleThresholdChange: (value: string) => void;
  threshold: number;
  membersCount: number;
}) => {
  const incDisabled = threshold >= membersCount;
  const decDisabled = threshold <= 1;
  return (
    <div className="threshold">
      <button
        disabled={decDisabled}
        onClick={() => handleThresholdChange(DEC)}
        type="button"
      >
        <Image
          src={decDisabled ? MINUS_ICON_DISABLED : MINUS_ICON}
          height={20}
          width={20}
          alt="Decrease"
        />
      </button>
      <div className="w-5 h-5 flex-center">{threshold}</div>
      <button
        disabled={incDisabled}
        onClick={() => handleThresholdChange(INC)}
        type="button"
      >
        <Image
          src={incDisabled ? PLUS_ICON_DISABLED : PLUS_ICON}
          height={20}
          width={20}
          alt="Increase"
        />
      </button>
    </div>
  );
};
