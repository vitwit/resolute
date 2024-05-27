import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import AssetsDropDown from '../AssetsDropDown';
import SingleSendForm from './SingleSendForm';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import useAuthzExecHelper from '@/custom-hooks/useAuthzExecHelper';
import { txBankSend } from '@/store/features/bank/bankSlice';
import { txTransfer } from '@/store/features/ibc/ibcSlice';

const SingleSend = ({ sortedAssets }: { sortedAssets: ParsedAsset[] }) => {
  const dispatch = useAppDispatch();
  const { isNativeTransaction, getChainIDFromAddress, getChainInfo } =
    useGetChainInfo();
  const { txSendInputs, txTransferInputs, getVoteTxInputs } = useGetTxInputs();
  const { txAuthzSend } = useAuthzExecHelper();

  const [selectedAsset, setSelectedAsset] = useState<ParsedAsset | null>(null);
  const [isIBC, setIsIBC] = useState(false);

  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);

  const feeAmount = selectedAsset
    ? getChainInfo(selectedAsset.chainID).feeAmount
    : 0;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
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
    if (!!asset && !!destinationChainID && destinationChainID != asset?.chainID)
      setIsIBC(true);
    else setIsIBC(false);
  };

  const clearForm = () => {
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

  return (
    <div className="single-send-box">
      <div className="select-network">Select Network</div>
      <div className="py-10 px-6 space-y-10">
        <div>
          <AssetsDropDown
            selectedAsset={selectedAsset}
            sortedAssets={sortedAssets}
            handleAssetChange={handleAssetChange}
          />
        </div>
        <SingleSendForm
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          feeAmount={feeAmount}
          setValue={setValue}
          selectedAsset={selectedAsset}
        />
      </div>
    </div>
  );
};

export default SingleSend;
