import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { fromBech32 } from '@cosmjs/encoding';
import { formatCoin } from '@/utils/util';
import { Decimal } from '@cosmjs/math';
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="from"
        control={control}
        render={({ field }) => (
          <TextField
            className="bg-[#FFFFFF1A] rounded-2xl mb-6"
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
            className="bg-[#FFFFFF1A] rounded-2xl mb-6"
            {...field}
            sx={sendTxnTextFieldStyles}
            placeholder="Recipient"
            fullWidth
            error={!!error}
            helperText={
              errors.recipient?.type === 'validate'
                ? 'Invalid recipient address'
                : error?.message
            }
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
      <div
        className="text-[12px] text-[#FFFFFF80] text-right cursor-pointer hover:underline underline-offset-2"
        onClick={() => setValue('amount', availableBalance)}
      >
        {formatCoin(availableBalance, currency.coinDenom)}
      </div>
      <Controller
        name="amount"
        control={control}
        rules={{
          required: 'Amount is required',
          validate: (value) => {
            return Number(value) > 0 && Number(value) <= availableBalance;
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            className="bg-[#FFFFFF1A] rounded-2xl mb-6"
            {...field}
            sx={sendTxnTextFieldStyles}
            error={!!error}
            helperText={
              errors.amount?.type === 'validate'
                ? 'Insufficient balance'
                : error?.message
            }
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

      <button type="submit" className="create-txn-form-btn">
        Add
      </button>
    </form>
  );
};

export default Send;
