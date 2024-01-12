import React, { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { CircularProgress, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import AllAssets from './components/AllAssets';
import useGetTxInputs from '@/custom-hooks/useGetTxInputs';
import { txBankSend } from '@/store/features/bank/bankSlice';
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
import { capitalizeFirstLetter } from '@/utils/util';
import useAssetsCardNumber from '@/custom-hooks/useAssetsCardNumber';
import useAuthzExecHelper from '@/custom-hooks/useAuthzExecHelper';

const SendPage = ({ sortedAssets }: { sortedAssets: ParsedAsset[] }) => {
  const [selectedAsset, setSelectedAsset] = useState<ParsedAsset | undefined>();
  const [slicedAssetsIndex, setSlicedAssetIndex] = useState(0);
  const dispatch = useAppDispatch();
  const { txSendInputs, txTransferInputs, getVoteTxInputs } = useGetTxInputs();
  const { isNativeTransaction, getChainIDFromAddress, getChainInfo } =
    useGetChainInfo();
  const sendTxStatus = useAppSelector((state) => state.bank.tx.status);
  const ibcTxStatus = useAppSelector((state) => state.ibc.txStatus);
  const balancesLoading = useAppSelector((state) => state.bank.balancesLoading);
  const sendProps = props.send;
  const [allAssetsDialogOpen, setAllAssetsDialogOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useState<boolean>(false);
  const feeAmount = selectedAsset
    ? getChainInfo(selectedAsset.chainID).feeAmount
    : 0;
  const isAuthzMode = useAppSelector((state) => state.authz.authzModeEnabled);
  const authzAddress = useAppSelector((state) => state.authz.authzAddress);
  const { txAuthzSend } = useAuthzExecHelper();
  const authzLoading = useAppSelector(
    (state) => state.authz.chains?.[selectedAsset?.chainID || '']?.tx?.status || TxStatus.INIT
  );

  const amountRules = {
    ...sendProps.amount,
    validate: {
      invalid: (value: string) =>
        !isNaN(Number(value)) || 'Please enter a valid amount',
      zeroAmount: (value: string) =>
        Number(value) !== 0 || 'Amount should be greater than 0',
      insufficient: (value: string) =>
        Number(selectedAsset?.balance) >= Number(value) + feeAmount ||
        'Insufficient funds',
    },
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      amount: 0,
      address: '',
      memo: '',
    },
  });

  const clearForm = () => {
    reset();
  };

  const [amountOption, setAmountOption] = useState('');

  const amountInputProps = {
    sx: sendProps.amount.inputProps.sx,
    endAdornment: selectedAsset ? (
      <div className="flex p-1 items-center gap-6">
        <div className="flex gap-6">
          <button
            type="button"
            className={
              'amount-options px-6 py-2 ' +
              (amountOption === 'half'
                ? 'amount-options-fill'
                : 'amount-options-default')
            }
            onClick={() => {
              setAmountOption('half');
              const amount = selectedAsset.balance;
              let halfAmount = Math.max(0, (amount || 0) - feeAmount) / 2;
              halfAmount = +halfAmount.toFixed(6);
              setValue('amount', halfAmount);
            }}
          >
            Half
          </button>
          <button
            type="button"
            className={
              `amount-options px-6 py-2 ` +
              (amountOption === 'max'
                ? 'amount-options-fill'
                : 'amount-options-default')
            }
            onClick={() => {
              setAmountOption('max');
              const amount = selectedAsset.balance;
              let maxAmount = Math.max(0, (amount || 0) - feeAmount);
              maxAmount = +maxAmount.toFixed(6);
              setValue('amount', maxAmount);
            }}
          >
            Max
          </button>
        </div>
        <InputAdornment position="start" className="w-[30px]">
          {selectedAsset?.displayDenom}
        </InputAdornment>
      </div>
    ) : null,
  };

  const [isIBC, setIsIBC] = useState(false);

  const onSelectAsset = (asset: ParsedAsset, index: number) => {
    if (selectedAsset == asset) return;
    checkIfIBCTransaction(asset);
    setSelectedAsset(asset);
    setSlicedAssetIndex(index);
  };

  const checkIfIBCTransaction = (asset = selectedAsset) => {
    const address = getValues('address');

    const destinationChainID = getChainIDFromAddress(address);
    if (!!asset && !!destinationChainID && destinationChainID != asset?.chainID)
      setIsIBC(true);
    else setIsIBC(false);
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

    const { rpc } = getVoteTxInputs(selectedAsset.chainID)

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
      txInputs.onTxSuccessCallBank = clearForm;
      dispatch(txBankSend({...txInputs, rpc}));
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
    <div className="flex flex-1 flex-col">
      {sortedAssets.length ? (
        <div className="h-full w-full space-y-6 flex flex-col flex-1">
          <div className="space-y-6">
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
            <div className="w-full flex flex-col mb-6">
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
                    handleBlur={checkIfIBCTransaction}
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
                <div className="flex h-6 items-center mb-2">
                  <div className="text-sm not-italic font-normal leading-[normal]">
                    Memo
                  </div>
                </div>
                <div className="memo-text-field">
                  <CustomMultiLineTextField
                    rows={5}
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
            {!isAuthzMode && isIBC && (
              <div className="h-[46px] rounded-2xl bg-[#32226a] mb-4 px-6 py-4 flex">
                <div className="flex flex-1 items-center gap-2">
                  <Image
                    src="/warning.svg"
                    width={32}
                    height={32}
                    alt="warning"
                  />
                  <div className="text-[#EFFF34] text-base not-italic font-normal leading-[normal] flex items-center">
                    This looks like a cross chain Transaction. Avoid IBC
                    transfers to centralized exchanges. Your assets may be lost.
                  </div>
                </div>
              </div>
            )}
            <CustomSubmitButton
              pendingStatus={
                (!isAuthzMode && (sendTxStatus === TxStatus.PENDING ||
                ibcTxStatus === TxStatus.PENDING) || (isAuthzMode && authzLoading === TxStatus.PENDING))
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
  const cardsCount = useAssetsCardNumber();
  const indexes = () => {
    if (slicedAssetsIndex < cardsCount || !selectedAsset)
      return { startIndex: 0, endIndex: cardsCount };
    return { startIndex: slicedAssetsIndex, endIndex: slicedAssetsIndex + 1 };
  };

  const { startIndex, endIndex } = indexes();

  return assets.length ? (
    <div
      className={` items-center justify-start gap-4 min-h-[100px] max-h-[100px] grid grid-cols-${cardsCount}`}
    >
      {assets.slice(startIndex, endIndex).map((asset, index) => (
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
          <div className="flex gap-2 items-center">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Image
                className="rounded-full"
                src={asset.chainLogoURL}
                width={32}
                height={32}
                alt={asset.chainName}
              />

              {/* <Image
                className="rounded-full hover:w-24"
                src={
                  '/' +
                  (asset.type === 'ibc'
                    ? asset.originDenomChainInfo.chainLogo
                    : '')
                }
                width={20}
                height={20}
                alt={asset.chainName}
                style={{ position: 'absolute', bottom: -5, left: -7 }}
              /> */}
            </div>
            <div className="text-base not-italic font-bold leading-[normal] break-all">
              {asset.balance}
            </div>

            <div className="flex items-center text-sm not-italic font-normal leading-[normal] text-capitalize">
              {asset.displayDenom}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="text-[#9c95ac] text-xs not-italic font-normal leading-[normal] flex items-center">
              on {capitalizeFirstLetter(asset.chainName)}{' '}
              {asset.type === 'ibc' ? ' (IBC)' : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : null;
};
