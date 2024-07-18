import { TextField } from '@mui/material';
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
import { createMultisigTextFieldStyles } from '../../styles';
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
import { TxStatus } from '@/types/enums';
import { fromBech32 } from '@cosmjs/encoding';
import { DialogCreateMultisigProps, PubKeyFields } from '@/types/multisig';
import {
  COSMOS_CHAIN_ID,
  DECREASE,
  INCREASE,
  MULTISIG_PUBKEY_OBJECT,
} from '@/utils/constants';
import useGetPubkey from '@/custom-hooks/useGetPubkey';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useGetAccountInfo from '@/custom-hooks/useGetAccountInfo';
import CustomDialog from '@/components/common/CustomDialog';
import CustomButton from '@/components/common/CustomButton';
import ImportMultisig from './ImportMultisig';
import AddMembers from './AddMember';
import Threshold from './Threshold';

const MAX_PUB_KEYS = 7;
const MULTISIG_NAME_MAX_LENGTH = 100;

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
          message: error?.message || FAILED_TO_GENERATE_MULTISIG,
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
          chainID: chainID,
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
    if (value === INCREASE) {
      if (threshold + 1 > pubKeyFields?.length) {
        dispatch(setError({ type: 'error', message: MAX_THRESHOLD_ERROR }));
      } else {
        setThreshold(threshold + 1);
      }
    } else if (value === DECREASE) {
      if (threshold - 1 < 1) {
        dispatch(setError({ type: 'error', message: MIN_THRESHOLD_ERROR }));
      } else {
        setThreshold(threshold - 1);
      }
    }
  };

  const switchToCreateMultisig = () => {
    setImportMultisig(false);
    setDefaultFormValues();
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
      title={importMultisig ? 'Import Multisig' : 'Create Multisig'}
      onClose={handleClose}
      styles="w-[800px] !text-[#ffffffad]"
    >
      <div className="w-full">
        {page === 1 ? (
          <div className="flex gap-10 items-center w-full">
            <div className="space-y-10 w-full">
              <form
                className="space-y-10 w-full"
                onSubmit={(e) => handleSubmit(e)}
              >
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
                      isImportMultisig={importMultisig}
                    />
                  </div>
                </div>
                <AddMembers
                  handleAddPubKey={handleAddPubKey}
                  handleChangeValue={handleChangeValue}
                  handleRemoveValue={handleRemoveValue}
                  importMultisig={importMultisig}
                  pubKeyFields={pubKeyFields}
                  togglePubKey={togglePubKey}
                />
                <div className="flex justify-end gap-">
                  {importMultisig ? (
                    <button
                      type="button"
                      className="secondary-btn w-[150px]"
                      onClick={resetCreateMultisig}
                    >
                      Cancel
                    </button>
                  ) : null}
                  <CustomButton
                    btnText={importMultisig ? 'Import' : 'Create'}
                    btnDisabled={
                      createMultiAccRes?.status === 'pending' || pubkeyLoading
                    }
                    btnLoading={
                      createMultiAccRes?.status === 'pending' || pubkeyLoading
                    }
                    btnType="submit"
                    btnStyles="w-[150px]"
                  />
                  {formError ? (
                    <div className="text-center w-full text-red-400 text-[14px]">
                      {formError}
                    </div>
                  ) : null}
                </div>
              </form>
              {!importMultisig ? (
                <div className="flex gap-1 justify-center">
                  <div className="text-[16px] font-extralight text-[#ffffff80]">
                    Have an existing MultiSig account ? Import it
                  </div>{' '}
                  <button
                    onClick={() => {
                      setMultisigAddress('');
                      setAddressValidationError('');
                      setName('');
                      setPage(2);
                      setImportMultisig(true);
                    }}
                    className="secondary-btn !text-[16px] !font-bold"
                  >
                    here
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <ImportMultisig
            addressValidationError={addressValidationError}
            fetchMultisigAccount={fetchMultisigAccount}
            handleMultisigAddressChange={handleMultisigAddressChange}
            multisigAddress={multisigAddress}
            switchToCreateMultisig={switchToCreateMultisig}
          />
        )}
      </div>
    </CustomDialog>
  );
};

export default DialogCreateMultisig;
