import { TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { fromBech32 } from '@cosmjs/encoding';
import { Decimal } from '@cosmjs/math';
import { sendTxnTextFieldStyles } from '../../styles';
import AddressField from '../AddressField';
import AmountInputField from '../AmountInputField';

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
        <div className="text-[14px] font-extralight">From</div>
        <AddressField control={control} name={'from'} />
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
                required
                autoFocus={true}
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
          <AmountInputField
            availableBalance={availableBalance}
            control={control}
            displayDenom={currency.coinDenom}
            feeAmount={feeAmount}
            setValue={setValue}
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
