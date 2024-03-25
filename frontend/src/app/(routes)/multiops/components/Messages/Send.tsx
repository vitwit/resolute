import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { fromBech32 } from '@cosmjs/encoding';
import { formatCoin } from '@/utils/util';
import { Decimal } from '@cosmjs/math';
import { INSUFFICIENT_BALANCE } from '@/utils/errors';
import { sendTxnTextFieldStyles } from '../../styles';

interface SendProps {
  address: string;
  onSend: (payload: Msg) => void;
  currency: Currency;
  availableBalance: number;
}

const Send: React.FC<SendProps> = (props) => {
  const { address, onSend, currency, availableBalance } = props;
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      amount: 0,
      recipient: '',
      from: address,
    },
  });

  const onSubmit = (data: {
    amount: number;
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
      className="flex flex-col justify-between gap-10"
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
      <div className="space-y-2">
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
      {/* <div
        className="mb-1 text-[12px] text-[#FFFFFF80] text-right cursor-pointer hover:underline underline-offset-2"
        onClick={() => setValue('amount', availableBalance)}
      >
        {formatCoin(availableBalance, currency.coinDenom)}
      </div> */}
      <div className="space-y-2">
        <div className="text-[14px] font-extralight">Enter Amount</div>
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
            render={({ field, fieldState: { error } }) => (
              <TextField
                className="bg-[#FFFFFF0D]"
                {...field}
                sx={sendTxnTextFieldStyles}
                error={!!error}
                placeholder="Amount"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      {currency.coinDenom}
                    </InputAdornment>
                  ),
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
        className="w-full text-[12px] font-medium primary-gradient rounded-lg h-8 flex justify-center items-center"
      >
        Add
      </button>
    </form>
  );
};

export default Send;
