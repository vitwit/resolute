import useSortedAssets from '@/custom-hooks/useSortedAssets';
import React, { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { CircularProgress, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import AllAssets from './components/AllAssets';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { txBankSend } from '@/store/features/bank/bankSlice';
import { SEND_TX_FEE } from '@/utils/constants';
import CustomTextField from '@/components/CustomTextField';
import props from './customTextFields.json';
import CustomSubmitButton from '@/components/CustomButton';

const SendPage = ({ chainIDs }: { chainIDs: string[] }) => {
  const [sortedAssets] = useSortedAssets(chainIDs, {showAvailable:true});
  const [openMemo, setOpenMemo] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<ParsedAsset | undefined>();
  const [slicedAssetsIndex, setSlicedAssetIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { txSendInputs } = useGetTxInputs();
  const sendTxStatus = useAppSelector((state) => state.bank.tx.status);
  const sendProps = props.send;

  const amountRules = {
    ...sendProps.amount,
    validate: {
      invalid: (value: string) => Number(value) > 0 || "Amount can't be zero",
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
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 0,
      address: '',
      memo: '',
    },
  });

  const onSelectAsset = (asset: ParsedAsset, index: number) => {
    if (selectedAsset == asset) return;
    setSelectedAsset(asset);
    setSlicedAssetIndex(Math.floor(index / 4) * 4);
    reset();
  };

  const onSubmit = (data: {
    amount: number;
    address: string;
    memo: string;
  }) => {
    if (!selectedAsset) {
      alert('Please select an asset');
      return;
    }
    const txInputs = txSendInputs(
      selectedAsset.chainID,
      data.address,
      data.amount,
      data.memo
    );
    dispatch(txBankSend(txInputs));
  };

  return (
    <div className="h-full w-full space-y-6">
      <div className="space-y-4">
        <div>Assets</div>
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
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div>
            <div className="text-sm not-italic font-normal leading-[normal] mb-2">
              Enter Address
            </div>
            <CustomTextField
              name={sendProps.address.name}
              rules={sendProps.address.rules}
              control={control}
              error={!!errors.address}
              textFieldClassName={sendProps.address.textFieldClassName}
              textFieldSize={sendProps.address.textFieldSize}
              placeHolder={sendProps.address.placeHolder}
              textFieldCustomMuiSx={sendProps.address.textFieldCustomMuiSx}
              inputProps={sendProps.address.inputProps}
              required={true}
            />

            <div
              className={`text-red-500 text-xs px-4 opacity-95 mt-1 min-h-[24px]`}
            >
              {errors.address?.type === 'validate'
                ? 'Enter a valid address.'
                : errors.address?.message}
            </div>
            <div className="text-sm not-italic font-normal leading-[normal] mb-2">
              Amount
            </div>
            <CustomTextField
              name={sendProps.amount.name}
              rules={amountRules}
              control={control}
              error={!!errors.amount}
              textFieldClassName={sendProps.amount.textFieldClassName}
              textFieldSize={sendProps.amount.textFieldSize}
              placeHolder={sendProps.amount.placeHolder}
              textFieldCustomMuiSx={sendProps.amount.textFieldCustomMuiSx}
              inputProps={amountInputProps}
              required={true}
            />

            <div
              className={`text-red-500 text-xs px-4 opacity-95 mt-1 min-h-[24px]`}
            >
              {!sortedAssets.length
                ? 'No Assets Found.'
                : !selectedAsset
                  ? 'Please select an Asset'
                  : errors.amount
                    ? errors.amount?.message
                    : ''}
            </div>
            <div className="min-h-[96px]">
              <div className="flex items-center gap-2  mb-2">
                <div className="flex items-center text-sm not-italic font-normal leading-[normal]">
                  Memo
                </div>
                <Image
                  onClick={() => setOpenMemo((openMemo) => !openMemo)}
                  src="/drop-down-icon.svg"
                  className="cursor-pointer"
                  width={16}
                  height={16}
                  alt=""
                />
              </div>
              {openMemo ? (
                <CustomTextField
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
              ) : null}
            </div>
          </div>
        </div>
        <div className="h-full flex gap-10 items-center">
          <CustomSubmitButton
            pendingStatus={sendTxStatus}
            buttonStyle="primary-action-btn w-[152px] h-[44px]"
            circularProgressSize={24}
            buttonContent="Send"
          />
        </div>
      </form>
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
  const balancesLoading = useAppSelector((state) => state.bank.balancesLoading);

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
            onClick={() => onSelectAsset(asset, index)}
          >
            <div className="flex gap-2">
              <Image
                src={asset.chainLogoURL}
                width={32}
                height={32}
                alt={asset.chainName}
              />
              <div className="flex items-center text-[14] text-capitalize">
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
  ) : (
    <div className="min-h-[100px] max-h-[100px] flex justify-center items-center">
      {balancesLoading ? <CircularProgress size={30} /> : <>- No Assets -</>}
    </div>
  );
};
