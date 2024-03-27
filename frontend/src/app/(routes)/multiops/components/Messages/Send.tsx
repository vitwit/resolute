import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { fromBech32 } from '@cosmjs/encoding';
import { Decimal } from '@cosmjs/math';
import { INSUFFICIENT_BALANCE } from '@/utils/errors';
import {
  sendTxnTextFieldStyles,
  textFieldInputPropStyles,
  textFieldStyles,
} from '../../styles';

interface SendProps {
  address: string;
  onSend: (payload: Msg) => void;
  currency: Currency;
  availableBalance: number;
  feeAmount: number;
}

const Send: React.FC<SendProps> = (props) => {
  const { address, onSend, currency, availableBalance, feeAmount } = props;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      amount: '',
      recipient: '',
      from: address,
    },
  });

  const onSubmit = (data: {
    amount: string;
    recipient: string;
    from: string;
  }) => {
    const amountInAtomics = Decimal.fromUserInput(
      data.amount.toString(),
      Number(currency.coinDecimals)
    ).atomics;

    const msgSend = {
      fromAddress: data.from,
      toAddress: data.recipient,
      amount: [
        {
          amount: amountInAtomics,
          denom: currency.coinMinimalDenom,
        },
      ],
    };

    const msg = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: msgSend,
    };

    onSend(msg);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between"
    >
      <div className="space-y-2">
        <div className="text-[14px] font-extralight">Address</div>
        <Controller
          name="from"
          control={control}
          render={({ field }) => (
            <TextField
              className="bg-[#FFFFFF0D]"
              {...field}
              sx={sendTxnTextFieldStyles}
              placeholder="From"
              disabled
              fullWidth
              InputProps={{
                sx: {
                  input: {
                    color: 'white !important',
                    fontSize: '14px',
                    padding: 2,
                  },
                },
              }}
            />
          )}
        />
      </div>
      <div className="space-y-2 mt-12">
        <div className="text-[14px] font-extralight">Recepient Address</div>
        <div>
          <Controller
            name="recipient"
            control={control}
            rules={{
              required: 'Recipient is required',
              validate: (value) => {
                try {
                  fromBech32(value);
                  return true;
                } catch (error) {
                  return false;
                }
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                className="bg-[#FFFFFF0D]"
                {...field}
                sx={sendTxnTextFieldStyles}
                placeholder="Recipient"
                fullWidth
                error={!!error}
                InputProps={{
                  sx: {
                    input: {
                      color: 'white',
                      fontSize: '14px',
                      padding: 2,
                    },
                  },
                }}
              />
            )}
          />
          <div className="error-box">
            <span
              className={
                !!errors.recipient
                  ? 'error-chip opacity-80'
                  : 'error-chip opacity-0'
              }
            >
              {errors?.recipient?.type === 'validate'
                ? 'Invalid recipient address'
                : errors?.recipient?.message}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-2 mt-[14px]">
        <div className="flex justify-between text-[14px] font-extralight">
          <div>Enter Amount</div>
          <div>
            Available Balance: <span>{availableBalance}</span>{' '}
            {currency.coinDenom}
          </div>
        </div>
        <div>
          <Controller
            name="amount"
            control={control}
            rules={{
              required: 'Amount is required',
              validate: (value) => {
                const amount = Number(value);
                if (isNaN(amount) || amount <= 0) return 'Invalid Amount';
                if (amount > availableBalance) return INSUFFICIENT_BALANCE;
              },
            }}
            render={({ field }) => (
              <TextField
                className="bg-[#FFFFFF0D] rounded-2xl"
                {...field}
                required
                fullWidth
                type="number"
                size="small"
                autoFocus={true}
                placeholder="Enter Amount Here"
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <div className="flex p-2 items-center gap-6">
                      <div className="flex gap-6">
                        <button
                          type="button"
                          className="amount-options px-4 py-2 amount-options-default"
                          onClick={() => {
                            const amount = availableBalance;
                            let halfAmount =
                              Math.max(0, (amount || 0) - feeAmount) / 2;
                            halfAmount = +halfAmount.toFixed(6);
                            setValue('amount', halfAmount.toString());
                          }}
                        >
                          Half
                        </button>
                        <button
                          type="button"
                          className="amount-options px-4 py-2 amount-options-default"
                          onClick={() => {
                            const amount = availableBalance;
                            let maxAmount = Math.max(
                              0,
                              (amount || 0) - feeAmount
                            );
                            maxAmount = +maxAmount.toFixed(6);
                            setValue('amount', maxAmount.toString());
                          }}
                        >
                          Max
                        </button>
                      </div>
                      <InputAdornment position="start" className="w-[30px]">
                        {currency.coinDenom}
                      </InputAdornment>
                    </div>
                  ),
                  sx: textFieldInputPropStyles,
                }}
              />
            )}
          />
          <div className="error-box">
            <span
              className={
                !!errors.amount
                  ? 'error-chip opacity-80'
                  : 'error-chip opacity-0'
              }
            >
              {errors.amount?.message}
            </span>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="mt-[14px] w-full text-[12px] font-medium primary-gradient rounded-lg h-8 flex justify-center items-center"
      >
        Add
      </button>
    </form>
  );
};

export default Send;
