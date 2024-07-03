import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import { TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Decimal } from '@cosmjs/math';

interface SendFormProps {
  address: string;
  onSend: (payload: Msg) => void;
  currency: Currency;
}

const SendForm = (props: SendFormProps) => {
  const { address, currency, onSend } = props;
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
    console.log("herer")
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
      className="flex flex-col justify-between h-full"
    >
      <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
        <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
          <div className="text-b1">Send</div>
          <div className="secondary-btn cursor-pointer">Cancel</div>
        </div>
        <div className="space-y-6 px-6 pb-6">
          <div className="flex-1 space-y-2">
            <div className="text-b1-light">Enter Address</div>
            <Controller
              name="recipient"
              control={control}
              render={({ field }) => (
                <TextField
                  className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                  {...field}
                  sx={{
                    ...customMUITextFieldStyles,
                  }}
                  placeholder="Address"
                  fullWidth
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
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-b1-light">Enter Amount</div>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                  {...field}
                  sx={{
                    ...customMUITextFieldStyles,
                  }}
                  placeholder="Enter amount"
                  fullWidth
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
          </div>
        </div>
      </div>
      <div>
        <button className="primary-btn w-full">Add</button>
      </div>
    </form>
  );
};

export default SendForm;
