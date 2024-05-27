import React from 'react';
import AddressField from './AddressField';
import AmountInputWrapper from './AmountInputWrapper';
import MemoField from './MemoField';
import { UseFormSetValue } from 'react-hook-form';
import CustomSubmitButton from '@/components/CustomButton';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';

type OnSubmit = (data: {
  amount: number | undefined;
  address: string;
  memo: string;
}) => void;

/* eslint-disable @typescript-eslint/no-explicit-any */
const SingleSendForm = ({
  control,
  handleSubmit,
  onSubmit,
  feeAmount,
  setValue,
  selectedAsset,
  isIBC,
}: {
  control: any;
  handleSubmit: any;
  onSubmit: OnSubmit;
  feeAmount: number;
  setValue: UseFormSetValue<{
    amount: string;
    address: string;
    memo: string;
  }>;
  selectedAsset: ParsedAsset | null;
  isIBC: boolean;
}) => {
  const sendTxStatus = useAppSelector((state) => state.bank.tx.status);
  const ibcTxStatus = useAppSelector((state) => state.ibc.txStatus);

  const quickSelectAmount = (value: string) => {
    if (selectedAsset) {
      const amount = selectedAsset.balance;
      if (value === 'half') {
        let halfAmount = Math.max(0, (amount || 0) - feeAmount) / 2;
        halfAmount = +halfAmount.toFixed(6);
        setValue('amount', halfAmount.toString());
      } else {
        let maxAmount = Math.max(0, (amount || 0) - feeAmount);
        maxAmount = +maxAmount.toFixed(6);
        setValue('amount', maxAmount.toString());
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="space-y-2">
        <div className="form-label-text">Enter recipient address</div>
        <AddressField control={control} />
      </div>
      <div>
        <AmountInputWrapper
          control={control}
          quickSelectAmount={quickSelectAmount}
          selectedAsset={selectedAsset}
        />
      </div>
      <div className="space-y-2">
        <div className="form-label-text">Enter Memo (Optional)</div>
        <MemoField control={control} />
      </div>
      <CustomSubmitButton
        isIBC={isIBC}
        pendingStatus={
          sendTxStatus === TxStatus.PENDING || ibcTxStatus === TxStatus.PENDING
        }
      />
    </form>
  );
};

export default SingleSendForm;
