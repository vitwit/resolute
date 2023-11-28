'use client';
import { Dialog, DialogContent, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import networkConfigFormat from '@/utils/networkConfigSchema.json';
import { ValidationError, validate } from 'jsonschema';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { get } from 'lodash';
import { establishWalletConnection } from '@/store/features/wallet/walletSlice';
import { ADD_NETWORK_TEMPLATE_URL } from '@/utils/constants';
import { networks } from '@/utils/chainsInfo';
import { getLocalNetworks, setLocalNetwork } from '@/utils/localStorage';
import { TxStatus } from '@/types/enums';
import { setError } from '@/store/features/common/commonSlice';
import { CHAIN_ID_EXIST_ERROR, CHAIN_NAME_EXIST_ERROR } from '@/utils/errors';
import { convertKeysToCamelCase } from '@/utils/util';

const DialogAddNetwork = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [requestNetwork, setRequestNetwork] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [chainIDExist, setChainIDExist] = useState<boolean>(false);
  const [chainNameExist, setChainNameExist] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [networkConfig, setNetworkConfig] = useState({});

  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const connectWalletStatus = useAppSelector(
    (state: RootState) => state.wallet.status
  );
  const dispatch = useAppDispatch();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as string;
      onFileContents(contents);
      setUploadedFileName(file.name);
    };
    reader.onerror = (e) => {
      alert(e);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const onFileContents = (content: string): void => {
    try {
      const parsedData = JSON.parse(content);
      const res = validate(parsedData, networkConfigFormat);
      setValidationErrors(res.errors);
      if (!get(res, 'errors.length')) {
        setChainNameExist(
          chainNameExists(get(parsedData, 'config.chain_name'))
        );
        setChainIDExist(chainIDExists(get(parsedData, 'config.chain_id')));
        setNetworkConfig(parsedData);
      } else {
        setNetworkConfig({});
      }
    } catch (e) {
      setNetworkConfig({});
      console.log(e);
    }
  };

  const chainNameExists = (chainName: string) => {
    const chainNamesList = Object.keys(nameToChainIDs);
    if (chainNamesList.includes(chainName.toLowerCase())) {
      return true;
    }
    return false;
  };

  const chainIDExists = (chainID: string) => {
    const chainNamesList = Object.keys(nameToChainIDs);
    for (const chain in chainNamesList) {
      if (
        nameToChainIDs[chainNamesList[chain]].toLowerCase() ===
        chainID.toLowerCase()
      ) {
        return true;
      }
    }
    return false;
  };

  const addNetwork = () => {
    const chainID = get(networkConfig, 'config.chain_id');
    if (!chainIDExist && !chainNameExist && chainID) {
      const networkConfigFormatted = convertKeysToCamelCase(networkConfig);
      setLocalNetwork(networkConfigFormatted, chainID);
      dispatch(
        establishWalletConnection({
          walletName: 'keplr',
          networks: [...networks, ...getLocalNetworks()],
        })
      );
    } else {
      setNetworkConfig({});
      setError({
        type: 'error',
        message: 'Invalid JSON file',
      });
    }
  };

  const handleAddNetworkType = (value: boolean) => {
    setRequestNetwork(value);
  };

  useEffect(() => {
    if (connectWalletStatus === TxStatus.IDLE) {
      handleClose();
    }
  }, [connectWalletStatus]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          opacity: '0.95',
          background: 'linear-gradient(90deg, #1F184E 27.66%, #8B3DA7 99.91%)',
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="pb-12 add-network">
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
          <div className="flex items-center">
            <div className="p-10">
              <Image
                src="/blocks-image.png"
                width={288}
                height={238}
                alt="Add Network"
              />
            </div>
            <div className="flex-1 px-10 flex flex-col gap-6">
              <h2 className="text-[20px] font-bold leading-normal">
                Add Network
              </h2>
              <div className="flex gap-6 text-white">
                <div
                  className="custom-radio-button-label"
                  onClick={() => handleAddNetworkType(false)}
                >
                  <div className="custom-radio-button">
                    {!requestNetwork ? (
                      <div className="custom-radio-button-checked"></div>
                    ) : null}
                  </div>
                  <div>Local Network</div>
                </div>
                <div
                  className="custom-radio-button-label"
                  onClick={() => handleAddNetworkType(true)}
                >
                  <div className="custom-radio-button">
                    {requestNetwork ? (
                      <div className="custom-radio-button-checked"></div>
                    ) : null}
                  </div>
                  <div>Request Network</div>
                </div>
              </div>
              {requestNetwork ? (
                <>
                  <div className="min-h-[272px] flex justify-center items-center">
                    Coming soon...
                  </div>
                </>
              ) : (
                <>
                  <div className="">
                    <div
                      className="file-upload-box"
                      onClick={() => {
                        document.getElementById('multisig_file')!.click();
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
                                    setChainIDExist(false);
                                    setChainNameExist(false);
                                    setShowErrors(false);
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
                            />
                            <div className="mt-2">Upload file here</div>
                          </>
                        )}
                      </div>
                      <input
                        id="multisig_file"
                        accept=".json"
                        hidden
                        type="file"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="mt-3 text-[14px] leading-normal font-light">
                      Download sample JSON file&nbsp;
                      <a
                        className="add-network-json-sample-link"
                        onClick={() => {
                          window.open(
                            ADD_NETWORK_TEMPLATE_URL,
                            '_blank',
                            'noopener,noreferrer'
                          );
                        }}
                      >
                        here
                      </a>
                    </div>
                  </div>
                  {uploadedFileName && validationErrors?.length ? (
                    <div className="w-full">
                      <div className="flex gap-4 items-center">
                        <div className="text-red-600 font-bold">
                          Invalid json file
                        </div>
                        <div
                          className="show-more-errors"
                          onClick={() =>
                            setShowErrors((showErrors) => !showErrors)
                          }
                        >
                          show more
                        </div>
                      </div>
                      {showErrors &&
                        validationErrors?.map((item, index) => (
                          <li key={index}>{item.stack}</li>
                        ))}
                    </div>
                  ) : (
                    <div>
                      {chainNameExist ? (
                        <li className="chain-exist-error">
                          {CHAIN_NAME_EXIST_ERROR}
                        </li>
                      ) : (
                        <></>
                      )}
                      {chainIDExist ? (
                        <li className="chain-exist-error">
                          {CHAIN_ID_EXIST_ERROR}
                        </li>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                  <div>
                    <button
                      className="add-network-button-2 gradient-bg"
                      onClick={() => addNetwork()}
                    >
                      {connectWalletStatus === 'pending' ? 'Loading..' : 'Add'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddNetwork;
