import React, { ChangeEvent, useEffect, useState } from 'react';
import CustomDialog from '../common/CustomDialog';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  setAddNetworkDialogOpen,
  setError,
} from '@/store/features/common/commonSlice';
import CustomButton from '../common/CustomButton';
import { validate, ValidationError } from 'jsonschema';
import { get } from 'lodash';
import { convertKeysToCamelCase } from '@/utils/util';
import { getLocalNetworks, setLocalNetwork } from '@/utils/localStorage';
import {
  establishWalletConnection,
  resetConnectWalletStatus,
} from '@/store/features/wallet/walletSlice';
import { networks } from '@/utils/chainsInfo';
import { TxStatus } from '@/types/enums';
import networkConfigFormat from '@/utils/networkConfigSchema.json';
import Image from 'next/image';
import { UPLOAD_ICON } from '@/constants/image-names';
import { ADD_NETWORK_TEMPLATE_URL } from '@/utils/constants';
import Link from 'next/link';
import { IconButton, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { CHAIN_ID_EXIST_ERROR, CHAIN_NAME_EXIST_ERROR } from '@/utils/errors';

const DialogAddNetwork = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.common.addNetworkOpen);
  const handleClose = () => {
    dispatch(setAddNetworkDialogOpen(false));
  };

  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [chainIDExist, setChainIDExist] = useState<boolean>(false);
  const [chainNameExist, setChainNameExist] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [networkConfig, setNetworkConfig] = useState({});

  const nameToChainIDs: Record<string, string> = useAppSelector(
    (state) => state.wallet.nameToChainIDs
  );
  const connectWalletStatus = useAppSelector((state) => state.wallet.status);

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
        parsedData.is_custom_network = true;
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

  useEffect(() => {
    if (uploadedFileName && !validationErrors?.length) {
      if (connectWalletStatus === TxStatus.IDLE) {
        handleClose();
        dispatch(setError({ type: 'success', message: 'Network Added' }));
      } else if (connectWalletStatus === TxStatus.REJECTED) {
        dispatch(setError({ type: 'error', message: 'Failed to add network' }));
      }
    }
  }, [connectWalletStatus]);

  useEffect(() => {
    dispatch(resetConnectWalletStatus());
  }, []);

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      styles="w-[800px]"
      title="Add Network"
      description="Add Network"
    >
      <div className="space-y-10">
        <div
          className="border-[1px] border-[#ffffff30] border-dashed rounded-2xl h-[200px] flex-center-center cursor-pointer"
          onClick={() => {
            document.getElementById('network_config_file')!.click();
          }}
        >
          {uploadedFileName ? (
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
          ) : (
            <div className="flex items-center gap-2 flex-col">
              <Image src={UPLOAD_ICON} width={24} height={24} alt="" />
              <div className="text-[14px] text-[#ffffffad]">
                Upload JSON here
              </div>
              <div className="flex items-center gap-1">
                <div className="secondary-text">Download Sample</div>
                <Link
                  href={ADD_NETWORK_TEMPLATE_URL}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[14px] underline underline-offset-[3px] font-bold text-[#ffffffad]"
                >
                  here
                </Link>
              </div>
            </div>
          )}
        </div>
        <div></div>
        <input
          id="network_config_file"
          accept=".json"
          hidden
          type="file"
          onChange={handleFileChange}
        />
        <div>
          {uploadedFileName && validationErrors?.length ? (
            <div className="w-full">
              <div className="flex gap-4 items-center">
                <div className="text-red-600 font-bold">Invalid json file</div>
                <div
                  className="secondary-btn"
                  onClick={() => setShowErrors((showErrors) => !showErrors)}
                >
                  view errors
                </div>
              </div>
              {showErrors &&
                validationErrors?.map((item, index) => (
                  <li key={index}>{item.stack}</li>
                ))}
            </div>
          ) : (
            <div className='text-red-500'>
              {chainNameExist ? <li>{CHAIN_NAME_EXIST_ERROR}</li> : <></>}
              {chainIDExist ? <li>{CHAIN_ID_EXIST_ERROR}</li> : <></>}
            </div>
          )}
        </div>
        <CustomButton
          btnText="Add Network"
          btnStyles="w-full"
          btnOnClick={addNetwork}
          btnLoading={connectWalletStatus === 'pending'}
          btnDisabled={connectWalletStatus === 'pending'}
        />
      </div>
    </CustomDialog>
  );
};

export default DialogAddNetwork;
