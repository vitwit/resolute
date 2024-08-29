import React, { useState } from 'react';
import { IconButton, SelectChangeEvent, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { AccessType } from 'cosmjs-types/cosmwasm/wasm/v1/types';
import useContracts from '@/custom-hooks/useContracts';
import { gzip } from 'node-gzip';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { uploadCode } from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';
import { setError } from '@/store/features/common/commonSlice';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import SelectPermissionType from './SelectPermissionType';
import AddAddresses from './AddAddresses';
import CustomButton from '@/components/common/CustomButton';

interface UploadContractInput {
  wasmFile?: File;
  permission: AccessType;
  allowedAddresses: Record<'address', string>[];
}

const UploadWasmFile = ({ chainID }: { chainID: string }) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const dispatch = useAppDispatch();
  const { uploadContract } = useContracts();
  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress, restURLs } = getChainInfo(chainID);

  // ------------------------------------------//
  // -----------------STATES-------------------//
  // ------------------------------------------//
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [accessType, setAccessType] = useState<AccessType>(3);
  const [addresses, setAddresses] = useState<string[]>(['']);

  const uploadContractStatus = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.txUpload.status
  );
  const uploadContractLoading = uploadContractStatus === TxStatus.PENDING;

  // ------------------------------------------------//
  // -----------------FORM HOOKS---------------------//
  // ------------------------------------------------//
  const { setValue, handleSubmit, getValues } = useForm<UploadContractInput>({
    defaultValues: {
      wasmFile: undefined,
      permission: AccessType.ACCESS_TYPE_EVERYBODY,
      allowedAddresses: [{ address: '' }],
    },
  });

  const validateAddresses = () => {
    for (const addr of addresses) {
      if (addr.length === 0) {
        return false;
      }
    }
    return true;
  };

  // ------------------------------------------------//
  // -----------------CHANGE HANDLERS----------------//
  // ------------------------------------------------//
  const handleAccessTypeChange = (event: SelectChangeEvent<AccessType>) => {
    setAccessType(event.target.value as AccessType);
    setValue('permission', event.target.value as AccessType);
  };

  const resetUploadedFile = () => {
    const fileInputElement = document.getElementById(
      'wasm-file-upload'
    ) as HTMLInputElement;
    fileInputElement.value = '';
    setValue('wasmFile', undefined);
  };

  // ------------------------------------------//
  // ---------------TRANSACTION----------------//
  // ------------------------------------------//
  const onUpload = async (data: UploadContractInput) => {
    const wasmcode = getValues('wasmFile')?.arrayBuffer();
    if (!wasmcode) {
      dispatch(
        setError({ type: 'error', message: 'Please upload the wasm file' })
      );
      return;
    }
    if (
      data.permission === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES &&
      !validateAddresses()
    ) {
      dispatch(setError({ type: 'error', message: 'Address cannot be empty' }));
      return;
    }
    const msg: Msg = {
      typeUrl: '/cosmwasm.wasm.v1.MsgStoreCode',
      value: {
        sender: walletAddress,
        wasmByteCode: await gzip(new Uint8Array(await wasmcode)),
        instantiatePermission: {
          permission: data.permission,
          addresses,
          address: '',
        },
      },
    };
    dispatch(
      uploadCode({
        chainID,
        address: walletAddress,
        messages: [msg],
        baseURLs: restURLs,
        uploadContract,
      })
    );
  };
  return (
    <div className="min-h-[calc(100vh-325px)] flex flex-col gap-10 justify-between">
      <form
        onSubmit={handleSubmit(onUpload)}
        className="flex-1 h-full flex flex-col gap-6"
        id="upload-wasm"
      >
        <div className="flex gap-10">
          <div
            className="w-[50%] justify-center upload-box-cosmwasm"
            onClick={() => {
              document.getElementById('wasm-file-upload')!.click();
            }}
          >
            <div className="flex gap-2 items-center cursor-pointer">
              {uploadedFileName ? (
                <>
                  <div className="font-bold">
                    {uploadedFileName}{' '}
                    <Tooltip title="Remove" placement="top">
                      <IconButton
                        aria-label="delete txn"
                        color="error"
                        onClick={(e) => {
                          if (!uploadContractLoading) {
                            setUploadedFileName('');
                            resetUploadedFile();
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </>
              ) : (
                <>
                  <Image
                    src="/icons/upload-icon.svg"
                    height={24}
                    width={24}
                    alt="Upload Icon"
                  />
                  <div className="text-b1">Upload (.wasm) file here</div>
                </>
              )}
            </div>
          </div>
          <input
            id="wasm-file-upload"
            accept=".wasm"
            hidden
            type="file"
            disabled={uploadContractLoading}
            onChange={(e) => {
              const { files } = e.target;
              const selectedFiles = files as FileList;
              const selectedFile = selectedFiles?.[0];
              setValue('wasmFile', selectedFile);
              setUploadedFileName(selectedFile?.name || '');
            }}
            style={{ display: 'none' }}
          />
          <div className="w-[50%] space-y-6">
            <div className="space-y-0">
              <div className="form-label-text">Select Instantiate Permission</div>
              <div className="flex flex-col gap-4">
                <SelectPermissionType
                  handleAccessTypeChange={handleAccessTypeChange}
                  accessType={accessType}
                />
              </div>
            </div>
            {accessType === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES ? (
              <div className="flex-1 min-h-40">
                <AddAddresses
                  addresses={addresses}
                  setAddresses={setAddresses}
                />
              </div>
            ) : null}
          </div>
        </div>
      </form>
      <CustomButton
        btnText="Upload Contract"
        btnType="submit"
        form="upload-wasm"
        btnStyles="w-full"
        btnLoading={uploadContractLoading}
        btnDisabled={uploadContractLoading}
      />
    </div>
  );
};

export default UploadWasmFile;
