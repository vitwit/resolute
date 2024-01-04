import { DialogDelegateProps } from '@/types/staking';
import { formatCoin, formatUnbondingPeriod } from '@/utils/util';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CLOSE_ICON_PATH } from '@/utils/constants';
import AmountInputField from './AmountInputField';
import ValidatorLogo from './ValidatorLogo';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';

const DialogDelegate = ({
  open,
  onClose,
  validator,
  stakingParams,
  availableBalance,
  loading,
  displayDenom,
  onDelegate,
  feeAmount,
}: DialogDelegateProps) => {
  const handleClose = () => {
    onClose();
    reset();
  };

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
      onDelegate({
        validator: validator?.operator_address || '',
        amount: Number(data?.amount) || 0,
      });
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="w-[890px] text-white">
          <div className="px-10 py-6 pt-10 flex justify-end">
            <div onClick={handleClose}>
              <Image
                className="cursor-pointer"
                src={CLOSE_ICON_PATH}
                width={24}
                height={24}
                alt="Close"
                draggable={false}
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
                      Available for Delegation
                    </div>
                    <div className="font-medium leading-10">
                      {formatCoin(availableBalance, displayDenom)}
                    </div>
                  </div>
                </div>
                <div className="bg-[#FFFFFF0D] px-4 rounded-2xl opacity-80 py-4 w-full space-y-4">
                  <div className="flex gap-2 text-[14px]">
                    <div className="w-[200px] font-light leading-[24px]">
                      <p>Staking will lock your</p>
                      <p>
                        funds for {formatUnbondingPeriod(stakingParams)} days
                      </p>
                    </div>
                    <div className="font-medium leading-6 flex-1">
                      <p>
                        You will need to undelegate in order for your staked
                        assets to be liquid again.{' '}
                      </p>
                      <p>
                        This process will take{' '}
                        {formatUnbondingPeriod(stakingParams)} days to complete.
                      </p>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <AmountInputField
                    control={control}
                    availableAmount={availableBalance}
                    displayDenom={displayDenom}
                    errors={errors}
                    setValue={setValue}
                    feeAmount={feeAmount}
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
                        'Delegate'
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

export default DialogDelegate;
