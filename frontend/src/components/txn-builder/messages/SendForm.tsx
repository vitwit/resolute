import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import { InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Decimal } from '@cosmjs/math';
import { formatCoin } from '@/utils/util';
import FileUpload from '../components/FileUpload';
import AddMsgButton from '../components/AddMsgButton';
import useGetAllAssets from '@/custom-hooks/multisig/useGetAllAssets';

interface SendFormProps {
  fromAddress: string;
  onSend: (payload: Msg) => void;
  currency: Currency;
  availableBalance: number;
  cancelAddMsg: () => void;
  chainID: string;
}

const SendForm = (props: SendFormProps) => {
  const {
    fromAddress,
    currency,
    onSend,
    availableBalance,
    cancelAddMsg,
    chainID,
  } = props;
  const { getAllAssets } = useGetAllAssets();
  const { allAssets } = getAllAssets(chainID, true);
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      amount: '',
      recipient: '',
      from: fromAddress,
    },
  });

  const [fileUploadTxns, setFileUploadTxns] = useState<Msg[]>([]);

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

  const onAddFileUploadTxns = (msgs: Msg[]) => {
    setFileUploadTxns(msgs);
  };

  const onRemoveFileUploadTxns = () => {
    setFileUploadTxns([]);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between gap-6 h-full"
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
              Remove
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
                    required
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
          onUpload={onAddFileUploadTxns}
          onCancel={onRemoveFileUploadTxns}
          msgsCount={fileUploadTxns?.length}
        />
      </div>
      <AddMsgButton
        fileUploadTxns={fileUploadTxns}
        handleAddMsgs={handleAddMsgs}
        onRemoveFileUploadTxns={onRemoveFileUploadTxns}
      />
    </form>
  );
};

export default SendForm;
