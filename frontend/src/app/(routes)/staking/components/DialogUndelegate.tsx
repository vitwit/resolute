import { DialogUndelegateProps } from '@/types/staking';
import {
  formatCoin,
  formatUnbondingPeriod,
  parseDelegation,
} from '@/utils/util';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { dialogBoxStyles } from '../styles';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import AmountInputField from './AmountInputField';
import ValidatorLogo from './ValidatorLogo';

const DialogUndelegate = ({
  open,
  onClose,
  validator,
  stakingParams,
  onUndelegate,
  loading,
  delegations,
  currency,
}: DialogUndelegateProps) => {
  const handleClose = () => {
    onClose();
    reset();
  };

  const delegationShare = parseDelegation({ delegations, validator, currency });
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      amount: '',
    },
  });

  const onSubmit = (data: { amount: string }) => {
    if (validator) {
      onUndelegate({
        validator: validator?.operator_address || '',
        amount: Number(data?.amount) || 0,
      });
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      PaperProps={dialogBoxStyles}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="max-w-[890px] text-white">
          <div className="px-10 py-6 pt-10 flex justify-end">
            <div onClick={handleClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
              />
            </div>
          </div>
          <div className="mb-10 flex gap-6 px-10 items-center">
            <div className="flex flex-col gap-10 w-full">
              <div className="flex items-center gap-2">
                <ValidatorLogo
                  identity={validator?.description?.identity || ''}
                  height={32}
                  width={32}
                />
                <h2 className="text-[20px] font-bold leading-normal">
                  {validator?.description?.moniker || '-'}
                </h2>
              </div>
              <div className="space-y-6">
                <div className="bg-[#FFFFFF0D] px-4 rounded-2xl opacity-80 py-2 w-full space-y-4">
                  <div className="flex gap-2">
                    <div className="w-[200px] text-[14px] font-light leading-10">
                      Commission
                    </div>
                    <div className="font-medium leading-10">
                      {Number(validator?.commission?.commission_rates?.rate) *
                        100}
                      %
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-[200px] text-[14px] font-light leading-10">
                      Available for Undelegation
                    </div>
                    <div
                      className="font-medium leading-10 cursor-pointer hover:underline underline-offset-2"
                      onClick={() => {
                        setValue('amount', delegationShare.toString());
                      }}
                    >
                      {formatCoin(delegationShare, currency.coinDenom)}
                    </div>
                  </div>
                </div>
                <div className="bg-[#FFFFFF0D] px-4 rounded-2xl opacity-80 py-4 w-full space-y-4">
                  <div className="flex gap-2 text-[14px]">
                    <div className="w-[200px] font-light leading-[24px]">
                      <p>Undelegating will lock</p>
                      <p>
                        your funds for {formatUnbondingPeriod(stakingParams)}{' '}
                        days
                      </p>
                    </div>
                    <div className="font-medium leading-6 flex-1">
                      <ol className="list-decimal space-y-2">
                        <li>You will not receive staking rewards. </li>
                        <li>You will not be able to cancel the unbonding.</li>
                        <li>
                          You will not be able to withdraw your funds until{' '}
                          {formatUnbondingPeriod(stakingParams)}+ days after the
                          undelegation.
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <AmountInputField
                    control={control}
                    availableAmount={delegationShare}
                    displayDenom={currency.coinDenom}
                    errors={errors}
                    setValue={setValue}
                    feeAmount={0}
                  />
                  <div className="mt-6 flex gap-10 items-center">
                    <button
                      type="submit"
                      className="dialog-delegate-button"
                      disabled={loading === 'pending'}
                    >
                      {loading === 'pending' ? (
                        <CircularProgress size={18} sx={{ color: 'white' }} />
                      ) : (
                        'Undelegate'
                      )}
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUndelegate;
