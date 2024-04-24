import React, { useState } from 'react';
import {
  CircularProgress,
  IconButton,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { AccessType } from 'cosmjs-types/cosmwasm/wasm/v1/types';
import SelectPermissionType from './SelectPermissionType';
import useContracts from '@/custom-hooks/useContracts';
import { gzip } from 'node-gzip';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { uploadCode } from '@/store/features/cosmwasm/cosmwasmSlice';
import { TxStatus } from '@/types/enums';
import { setError } from '@/store/features/common/commonSlice';
import AddAddresses from './AddAddresses';

interface UploadContractI {
  chainID: string;
  walletAddress: string;
  restURLs: string[];
}

interface UploadContractInput {
  wasmFile?: File;
  permission: AccessType;
  allowedAddresses: Record<'address', string>[];
}

const UploadContract = (props: UploadContractI) => {
  const { chainID, walletAddress, restURLs } = props;

  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const dispatch = useAppDispatch();
  const { uploadContract } = useContracts();

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
    <form
      onSubmit={handleSubmit(onUpload)}
      className="flex-1 h-full flex flex-col gap-6"
    >
      <div className="flex gap-6 h-full">
        <div
          className="file-upload-box !w-1/2 !h-full !bg-[#FFFFFF0D]"
          onClick={() => {
            document.getElementById('wasm-file-upload')!.click();
          }}
        >
          <div className="flex flex-col items-center justify-center">
            {uploadedFileName ? (
              <>
                <div className="font-bold">
                  {uploadedFileName}{' '}
                  <Tooltip title="Remove" placement="top">
                    <IconButton
                      aria-label="delete txn"
                      color="error"
                      onClick={(e) => {
                        setUploadedFileName('');
                        resetUploadedFile();
                        e.stopPropagation();
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
                  src="/file-upload-icon.svg"
                  width={32}
                  height={32}
                  alt="Upload file"
                  draggable={false}
                />
                <div className="mt-2">Upload (.wasm) file here</div>
              </>
            )}
          </div>
          <input
            id="wasm-file-upload"
            accept=".wasm"
            hidden
            type="file"
            onChange={(e) => {
              const { files } = e.target;
              const selectedFiles = files as FileList;
              const selectedFile = selectedFiles?.[0];
              setValue('wasmFile', selectedFile);
              setUploadedFileName(selectedFile?.name || '');
            }}
          />
        </div>
        <div className="w-1/2 flex flex-col gap-6">
          <div className="space-y-6">
            <div className="attach-funds-header">
              <div className="text-[18px] font-bold">
                Select Instantiate Permission
              </div>
              {/* TODO: Update the dummy description */}
              <div className="attach-funds-description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Necessitatibus fuga consectetur reiciendis fugit suscipit ab.
              </div>
            </div>
            <SelectPermissionType
              handleAccessTypeChange={handleAccessTypeChange}
              accessType={accessType}
            />
          </div>
          {accessType === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES ? (
            <div className="flex-1 min-h-40">
              <AddAddresses addresses={addresses} setAddresess={setAddresses} />
            </div>
          ) : null}
        </div>
      </div>
      <button
        disabled={uploadContractLoading}
        className="primary-gradient upload-btn"
      >
        {uploadContractLoading ? (
          <CircularProgress size={18} sx={{ color: 'white' }} />
        ) : (
          <>Upload Contract</>
        )}
      </button>
    </form>
  );
};

export default UploadContract;
