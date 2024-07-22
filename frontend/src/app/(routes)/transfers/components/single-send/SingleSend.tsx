import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SingleSendForm from './SingleSendForm';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  setChangeNetworkDialogOpen,
  setError,
} from '@/store/features/common/commonSlice';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import useAuthzExecHelper from '@/custom-hooks/useAuthzExecHelper';
import { setIBCSendAlert, txBankSend } from '@/store/features/bank/bankSlice';
import { txTransfer } from '@/store/features/ibc/ibcSlice';
import Image from 'next/image';
import { shortenAddress, shortenName } from '@/utils/util';
import { Box } from '@mui/material';
import { ALL_NETWORKS_ICON } from '@/utils/constants';
import AssetsDropDown from './AssetsDropDown';
import TxnLoading from '../txn-loading/TxnLoading';
import { get } from 'lodash';
import { TxStatus } from '@/types/enums';
import { ALERT_ICON } from '@/constants/image-names';

const SingleSend = ({ sortedAssets }: { sortedAssets: ParsedAsset[] }) => {
  const dispatch = useAppDispatch();
  const { isNativeTransaction, getChainIDFromAddress, getChainInfo } =
    useGetChainInfo();
  const { txSendInputs, txTransferInputs, getVoteTxInputs } = useGetTxInputs();
  const { txAuthzSend } = useAuthzExecHelper();

  const [selectedAsset, setSelectedAsset] = useState<ParsedAsset | null>(null);
  const [isIBC, setIsIBC] = useState(false);
  const [chainLogo, setChainLogo] = useState(ALL_NETWORKS_ICON);
  const [chainGradient, setChainGradient] = useState('');
  const [toAddress, setToAddress] = useState('');

  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const selectedNetwork = useAppSelector(
    (state) => state.common.selectedNetwork
  );
  const allNetworks = useAppSelector((state) => state.common.allNetworksInfo);
  const nameToChainIDs = useAppSelector((state) => state.wallet.nameToChainIDs);
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);
  const balancesLoading = useAppSelector((state) => state.bank.balancesLoading);
  const sendTxStatus = useAppSelector((state) => state.bank.tx.status);
  const ibcTxStatus = useAppSelector((state) => state.ibc.txStatus);

  const feeAmount = selectedAsset
    ? getChainInfo(selectedAsset.chainID).feeAmount
    : 0;

  const { handleSubmit, control, reset, getValues, setValue } = useForm({
    defaultValues: {
      amount: '',
      address: '',
      memo: '',
    },
  });

  const handleAssetChange = (option: ParsedAsset | null) => {
    setSelectedAsset(option);
    checkIfIBCTransaction(option);
  };

  const checkIfIBCTransaction = (asset = selectedAsset) => {
    const address = getValues('address');

    const destinationChainID = getChainIDFromAddress(address);
    if (
      !!asset &&
      !!destinationChainID &&
      destinationChainID != asset?.chainID
    ) {
      setIsIBC(true);
      dispatch(setIBCSendAlert(true));
    } else {
      setIsIBC(false);
      dispatch(setIBCSendAlert(false));
    }
  };

  const clearForm = () => {
    setToAddress('');
    reset();
  };

  const onSubmit = (data: {
    amount: number | undefined;
    address: string;
    memo: string;
  }) => {
    if (!selectedAsset) {
      dispatch(
        setError({
          type: 'error',
          message: `Please select an asset`,
        })
      );
      return;
    }
    if (!data.amount) {
      dispatch(
        setError({
          type: 'error',
          message: `Amount can't be zero`,
        })
      );

      return;
    }

    const { rpc } = getVoteTxInputs(selectedAsset.chainID);
    if (isNativeTransaction(selectedAsset.chainID, data.address)) {
      const txInputs = txSendInputs(
        selectedAsset.chainID,
        data.address,
        data.amount,
        data.memo,
        selectedAsset.denom,
        selectedAsset.decimals
      );
      if (isAuthzMode) {
        txAuthzSend({
          granter: authzAddress,
          grantee: txInputs.from,
          recipient: txInputs.to,
          denom: txInputs.assetDenom,
          amount: txInputs.amount,
          chainID: txInputs.basicChainInfo.chainID,
          memo: txInputs.memo,
        });
        return;
      }
      txInputs.onTxSuccessCallBack = clearForm;
      dispatch(txBankSend({ ...txInputs, rpc }));
    } else {
      const destChainID = getChainIDFromAddress(data.address);

      if (!destChainID) {
        dispatch(
          setError({
            type: 'error',
            message: 'Invalid Address',
          })
        );
        return;
      }

      if (isAuthzMode) {
        dispatch(
          setError({
            type: 'error',
            message: 'The IBC Transactions are not yet supported on Authz mode',
          })
        );
        return;
      }

      const txInputs = txTransferInputs(
        selectedAsset.chainID,
        destChainID,
        data.address,
        data.amount,
        selectedAsset.denom,
        selectedAsset.decimals
      );

      dispatch(txTransfer(txInputs));
    }
  };

  const changeNetwork = () => {
    dispatch(setChangeNetworkDialogOpen({ open: true, showSearch: false }));
  };

  useEffect(() => {
    if (selectedNetwork.chainName && isWalletConnected) {
      const chainID = nameToChainIDs[selectedNetwork.chainName];
      setChainLogo(allNetworks[chainID].logos.menu);
      setChainGradient(allNetworks[chainID].config.theme.gradient);
    } else {
      setChainLogo(ALL_NETWORKS_ICON);
    }
  }, [selectedNetwork]);

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-10 justify-between items-center">
      <div className="max-w-[550px]">
        <div className="single-send-box">
          <Box
            sx={{
              background:
                chainGradient ||
                'linear-gradient(180deg, #72727360 0%, #12131C80 100%)',
            }}
            className="select-network"
          >
            <div
              onClick={() => changeNetwork()}
              className="flex items-center gap-2 cursor-pointer w-fit"
            >
              <Image src={chainLogo} height={40} width={40} alt="" />
              <div className="text-[20px] font-bold capitalize">
                {shortenName(selectedNetwork.chainName, 15) || 'All Networks'}
              </div>
              <Image src="/drop-down-icon.svg" height={24} width={24} alt="" />
            </div>
          </Box>
          <div className="py-10 pt-12 px-6 flex gap-10 flex-col justify-between h-[630px]">
            <div>
              <AssetsDropDown
                selectedAsset={selectedAsset}
                sortedAssets={sortedAssets}
                handleAssetChange={handleAssetChange}
                loading={!!balancesLoading}
              />
            </div>
            <SingleSendForm
              control={control}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              feeAmount={feeAmount}
              setValue={setValue}
              selectedAsset={selectedAsset}
              isIBC={isIBC}
              checkIfIBCTransaction={checkIfIBCTransaction}
            />
          </div>
        </div>
      </div>
      {selectedAsset &&
      (sendTxStatus === TxStatus.PENDING ||
        ibcTxStatus === TxStatus.PENDING) ? (
        <SingleSendLoading
          chainID={selectedAsset?.chainID}
          isIBC={isIBC}
          toAddress={getValues('address')}
          amount={getValues('amount')}
          displayDenom={selectedAsset?.displayDenom}
        />
      ) : null}
    </div>
  );
};

export default SingleSend;

const SingleSendLoading = ({
  chainID,
  isIBC,
  toAddress,
  amount,
  displayDenom,
}: {
  chainID: string;
  isIBC: boolean;
  toAddress: string;
  amount: string;
  displayDenom: string;
}) => {
  const { getChainInfo, getChainIDFromAddress } = useGetChainInfo();
  const destinationChainID = isIBC ? getChainIDFromAddress(toAddress) : chainID;
  const { address: fromAddress, chainLogo: fromChainLogo } =
    getChainInfo(chainID);
  const allNetworks = useAppSelector((state) => state.common.allNetworksInfo);
  const { chainLogo: toChainLogo } = getChainInfo(destinationChainID);
  const fromChainColor = get(
    allNetworks?.[chainID],
    'config.theme.primaryColor'
  );
  const toChainColor = get(
    allNetworks?.[destinationChainID],
    'config.theme.primaryColor'
  );
  return (
    <div className="space-y-2 w-full px-10">
      <TxnLoading
        fromAddress={fromAddress}
        toChainLogo={toChainLogo}
        fromChainColor={fromChainColor}
        toChainColor={toChainColor}
        fromChainLogo={fromChainLogo}
        toAddress={toAddress}
      />
      <div className="px-6 py-4 rounded-2xl bg-[#FFFFFF14] text-[14px] space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Image src={ALERT_ICON} width={24} height={24} alt="" />
            <div className="text-[#FFC13C]">Important</div>
          </div>
          <div className="text-[#FFFFFF80]">
            Transaction pending<span className="dots-flashing"></span>
          </div>
        </div>
        <div className="">
          You are sending{' '}
          <span className="font-medium">
            {amount} {displayDenom}
          </span>{' '}
          to {shortenAddress(toAddress, 20)}
        </div>
      </div>
    </div>
  );
};
