import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Decimal } from '@cosmjs/math';
import { formatCoin } from '@/utils/util';
import FileUpload from '../components/FileUpload';

interface SendFormProps {
  fromAddress: string;
  onSend: (payload: Msg) => void;
  currency: Currency;
  availableBalance: number;
  cancelAddMsg: () => void;
}

const SendForm = (props: SendFormProps) => {
  const { fromAddress, currency, onSend, availableBalance, cancelAddMsg } =
    props;
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      amount: '',
      recipient: '',
      from: fromAddress,
    },
  });

  const onSubmit = (data: {
    amount: string;
    recipient: string;
    from: string;
  }) => {
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
    reset();
  };

  const handleAddMsgs = (msgs: Msg[]) => {
    for (const msg of msgs) {
      onSend(msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between h-full"
    >
      <div className="space-y-6">
        <div className="bg-[#FFFFFF05] rounded-2xl space-y-2">
          <div className="bg-[#FFFFFF05] rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="text-b1">Send</div>
            <button
              className="secondary-btn"
              onClick={cancelAddMsg}
              type="button"
            >
              Cancel
            </button>
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
                      endAdornment: (
                        <div className="text-small-light">
                          <InputAdornment
                            position="start"
                            sx={{ color: '#ffffff80' }}
                          >
                            {'Available:'}{' '}
                            {formatCoin(availableBalance, currency.coinDenom)}{' '}
                          </InputAdornment>
                        </div>
                      ),
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <FileUpload
          fromAddress={fromAddress}
          msgType="Send"
          onUpload={handleAddMsgs}
        />
      </div>
      <div>
        <button className="primary-btn w-full">Add</button>
      </div>
    </form>
  );
};

export default SendForm;
