import React, { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { CircularProgress, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import AllAssets from './components/AllAssets';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { txBankSend } from '@/store/features/bank/bankSlice';
import { SEND_TX_FEE } from '@/utils/constants';
import CustomTextField, {
  CustomMultiLineTextField,
} from '@/components/CustomTextField';
import props from './customTextFields.json';
import CustomSubmitButton from '@/components/CustomButton';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { txTransfer } from '@/store/features/ibc/ibcSlice';
import { TxStatus } from '@/types/enums';
import { setError } from '@/store/features/common/commonSlice';
import NoAssets from '@/components/illustrations/NoAssets';

const SendPage = ({ sortedAssets }: { sortedAssets: ParsedAsset[] }) => {
  const [selectedAsset, setSelectedAsset] = useState<ParsedAsset | undefined>();
  const [slicedAssetsIndex, setSlicedAssetIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { txSendInputs, txTransferInputs } = useGetTxInputs();
  const { isNativeTransaction, getChainIDFromAddress } = useGetChainInfo();
  const sendTxStatus = useAppSelector((state) => state.bank.tx.status);
  const ibcTxStatus = useAppSelector((state) => state.ibc.txStatus);
  const balancesLoading = useAppSelector((state) => state.bank.balancesLoading);
  const sendProps = props.send;
  const [allAssetsDialogOpen, setAllAssetsDialogOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useState<boolean>(false);

  const amountRules = {
    ...sendProps.amount,
    validate: {
      invalid: (value: string) =>
        !isNaN(Number(value)) || 'Please enter a valid amount',
      zeroAmount: (value: string) =>
        Number(value) !== 0 || 'Amount should be greater than 0',
      insufficient: (value: string) =>
        Number(selectedAsset?.balance) >
          Number(value) +
            Number(SEND_TX_FEE / 10 ** (selectedAsset?.decimals || 0)) ||
        'Insufficient funds',
    },
  };
  const amountInputProps = {
    sx: sendProps.amount.inputProps.sx,
    endAdornment: (
      <InputAdornment position="start">
        {selectedAsset?.displayDenom}
      </InputAdornment>
    ),
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: undefined,
      address: '',
      memo: '',
    },
  });

  const onSelectAsset = (asset: ParsedAsset, index: number) => {
    if (selectedAsset == asset) return;
    setSelectedAsset(asset);
    setSlicedAssetIndex(Math.floor(index / 4) * 4);
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

    if (isNativeTransaction(selectedAsset.chainID, data.address)) {
      const txInputs = txSendInputs(
        selectedAsset.chainID,
        data.address,
        data.amount,
        data.memo,
        selectedAsset.denom,
        selectedAsset.decimals
      );
      dispatch(txBankSend(txInputs));
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
    <div className="flex flex-1 flex-col">
      {sortedAssets.length ? (
        <div className="h-full w-full space-y-10 flex flex-col flex-1">
          <div className="space-y-4">
            <div className="flex items-center gap-2 h-6">
              <div>Assets</div>
              {!sortedAssets.length ? (
                <div className="errors-chip">No Assets Found</div>
              ) : !selectedAsset ? (
                <div className="errors-chip">Please select an Asset</div>
              ) : null}
            </div>
            <Cards
              assets={sortedAssets}
              slicedAssetsIndex={slicedAssetsIndex}
              selectedAsset={selectedAsset}
              onSelectAsset={onSelectAsset}
            />

            <AllAssets
              assets={sortedAssets}
              selectedAsset={selectedAsset}
              onSelectAsset={onSelectAsset}
              dialogOpen={allAssetsDialogOpen}
              setDialogOpen={setAllAssetsDialogOpen}
            />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col flex-1"
          >
            <div className="w-full flex flex-col flex-1 mb-6">
              <div className="flex flex-col gap-4 justify-between w-full">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2 h-6 items-center">
                    <div className="text-sm not-italic font-normal leading-[normal]">
                      Recipient Address
                    </div>
                    {errors.address ? (
                      <div className="errors-chip">
                        {errors.address?.message}
                      </div>
                    ) : null}
                  </div>
                  <CustomTextField
                    name={sendProps.address.name}
                    rules={sendProps.address.rules}
                    control={control}
                    error={!!errors.address}
                    textFieldClassName={sendProps.address.textFieldClassName}
                    textFieldSize={sendProps.address.textFieldSize}
                    placeHolder={sendProps.address.placeHolder}
                    textFieldCustomMuiSx={
                      sendProps.address.textFieldCustomMuiSx
                    }
                    inputProps={sendProps.address.inputProps}
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center h-6">
                    <div className="text-sm not-italic font-normal leading-[normal]">
                      Amount
                    </div>
                    {!!errors.amount && (
                      <div className="errors-chip">
                        {errors.amount?.message}
                      </div>
                    )}
                  </div>
                  <div
                    onClick={() => {
                      if (!selectedAsset) {
                        setAllAssetsDialogOpen(true);
                      }
                    }}
                  >
                    <CustomTextField
                      name={sendProps.amount.name}
                      rules={amountRules}
                      control={control}
                      error={!!errors.amount}
                      textFieldClassName={sendProps.amount.textFieldClassName}
                      textFieldSize={sendProps.amount.textFieldSize}
                      placeHolder={sendProps.amount.placeHolder}
                      textFieldCustomMuiSx={
                        sendProps.amount.textFieldCustomMuiSx
                      }
                      inputProps={amountInputProps}
                      required={true}
                    />
                  </div>
                </div>
              </div>
              <div className="min-h-[72px] mt-4 flex flex-col flex-1">
                <div className="flex items-center gap-2  mb-2">
                  <div className="flex items-center text-sm not-italic font-normal leading-[normal]">
                    Memo
                  </div>
                </div>
                <div className="flex flex-1 overflow-hidden bg-[#FFFFFF0D] rounded-2xl px-6 pt-6">
                  <CustomMultiLineTextField
                    rows={6}
                    name={sendProps.memo.name}
                    control={control}
                    error={!!errors.memo}
                    textFieldClassName={sendProps.memo.textFieldClassName}
                    rules={sendProps.memo.rules}
                    textFieldSize={sendProps.memo.textFieldSize}
                    placeHolder={sendProps.memo.placeHolder}
                    textFieldCustomMuiSx={sendProps.memo.textFieldCustomMuiSx}
                    inputProps={sendProps.memo.inputProps}
                    required={false}
                  />
                </div>
              </div>
            </div>
            <CustomSubmitButton
              pendingStatus={
                sendTxStatus === TxStatus.PENDING ||
                ibcTxStatus === TxStatus.PENDING
              }
              buttonStyle="primary-custom-btn w-[144px]"
              circularProgressSize={24}
              buttonContent="Send"
            />
          </form>
        </div>
      ) : balancesLoading ? (
        <div className="flex flex-1 justify-center items-center">
          <CircularProgress size={30} />
        </div>
      ) : (
        <NoAssets />
      )}
    </div>
  );
};

export default SendPage;

const Cards = ({
  assets,
  selectedAsset,
  onSelectAsset,
  slicedAssetsIndex,
}: {
  assets: ParsedAsset[];
  slicedAssetsIndex: number;
  selectedAsset: ParsedAsset | undefined;
  onSelectAsset: (asset: ParsedAsset, index: number) => void;
}) => {
  return assets.length ? (
    <div className=" items-center justify-start gap-4 min-h-[100px] max-h-[100px] grid grid-cols-4">
      {assets
        .slice(slicedAssetsIndex, slicedAssetsIndex + 4)
        .map((asset, index) => (
          <div
            className={
              'card p-4 cursor-pointer' +
              (asset.denom === selectedAsset?.denom &&
              asset.chainID === selectedAsset?.chainID
                ? ' selected'
                : '')
            }
            key={index + ' ' + asset.chainID + ' ' + asset.displayDenom}
            onClick={() => onSelectAsset(asset, slicedAssetsIndex + index)}
          >
            <div className="flex gap-2">
              <Image
                className="rounded-full"
                src={asset.chainLogoURL}
                width={32}
                height={32}
                alt={asset.chainName}
              />
              <div className="flex items-center text-sm not-italic font-normal leading-[normal] text-capitalize">
                {asset.chainName}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="text-base not-italic font-bold leading-[normal]">
                {asset.balance}
              </div>
              <div className="text-[#9c95ac] text-xs not-italic font-normal leading-[normal] flex items-center">
                {asset.displayDenom}
              </div>
            </div>
          </div>
        ))}
    </div>
  ) : null;
};
