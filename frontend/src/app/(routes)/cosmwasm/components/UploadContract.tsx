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

interface UploadContractInput {
  wasmFile?: File;
  permission: AccessType;
  allowedAddresses: Record<'address', string>[];
}

const UploadContract = ({
  chainID,
  walletAddress,
  restURLs,
}: {
  chainID: string;
  walletAddress: string;
  restURLs: string[];
}) => {
  const dispatch = useAppDispatch();
  const { uploadContract } = useContracts();

  const uploadContractStatus = useAppSelector(
    (state) => state.cosmwasm.chains?.[chainID]?.txUpload.status
  );
  const uploadContractLoading = uploadContractStatus === TxStatus.PENDING;

  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [accessType, setAccessType] = useState<AccessType>(3);

  const resetUploadedFile = () => {
    const fileInputElement = document.getElementById(
      'wasm-file-upload'
    ) as HTMLInputElement;
    fileInputElement.value = '';
    setValue('wasmFile', undefined);
  };

  const { setValue, handleSubmit, getValues } = useForm<UploadContractInput>({
    defaultValues: {
      wasmFile: undefined,
      permission: AccessType.ACCESS_TYPE_EVERYBODY,
      allowedAddresses: [{ address: '' }],
    },
  });

  const handleAccessTypeChange = (event: SelectChangeEvent<AccessType>) => {
    setAccessType(event.target.value as AccessType);
  };

  const onUpload = async (data: UploadContractInput) => {
    const wasmcode = getValues('wasmFile')?.arrayBuffer();
    if (wasmcode) {
      const msg: Msg = {
        typeUrl: '/cosmwasm.wasm.v1.MsgStoreCode',
        value: {
          sender: walletAddress,
          wasmByteCode: await gzip(new Uint8Array(await wasmcode)),
          instantiatePermission: {
            permission: accessType,
            addresses: [],
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
    }
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
                <div className="mt-2">Upload file here</div>
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
            <div className="border-b-[1px] border-[#ffffff1e] pb-4 space-y-2">
              <div className="text-[18px] font-bold">
                Select Instantiate Permission
              </div>
              {/* TODO: Update the dummy description */}
              <div className="leading-[18px] text-[12px] font-extralight">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Necessitatibus fuga consectetur reiciendis fugit suscipit ab.
              </div>
            </div>
            <SelectPermissionType
              handleAccessTypeChange={handleAccessTypeChange}
              accessType={accessType}
            />
          </div>
          <div className="flex-1 overflow-y-scroll"></div>
        </div>
      </div>
      <button
        disabled={uploadContractLoading}
        className="primary-gradient rounded-lg py-[6px] flex-1 w-full"
      >
        {uploadContractLoading ? (
          <CircularProgress size={16} sx={{ color: 'white' }} />
        ) : (
          <>Upload Contract</>
        )}
      </button>
    </form>
  );
};

export default UploadContract;
