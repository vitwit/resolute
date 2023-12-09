import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { fromBech32 } from '@cosmjs/encoding';
import { formatCoin } from '@/utils/util';
import { Decimal } from '@cosmjs/math';

interface SendProps {
  chainID: string;
  address: string;
  onSend: (payload: Msg) => void;
  currency: Currency;
  availableBalance: number;
}

const textFieldStyles = {
  '& .MuiTypography-body1': {
    color: 'white',
    fontSize: '12px',
    fontWeight: 200,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .Mui-disabled': {
    '-webkit-text-fill-color': '#ffffff6b !important',
  },
};

const Send = ({
  chainID,
  address,
  onSend,
  currency,
  availableBalance,
}: SendProps) => {
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

  const onSubmit = (data: any) => {
    const amountInAtomics = Decimal.fromUserInput(
      data.amount,
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
            sx={textFieldStyles}
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
            sx={textFieldStyles}
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
            return Number(value) > 0;
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            className="bg-[#FFFFFF1A] rounded-2xl mb-6"
            {...field}
            sx={textFieldStyles}
            error={!!error}
            helperText={
              errors.amount?.type === 'validate'
                ? 'Invalid amount'
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

      <Box
        component="div"
        sx={{
          textAlign: 'center',
        }}
      >
        <Button
          type="submit"
          variant="contained"
          disableElevation
          sx={{
            mt: 2,
            justifyContent: 'center',
            textTransform: 'none',
          }}
        >
          Add transaction
        </Button>
      </Box>
    </form>
  );
};

export default Send;
