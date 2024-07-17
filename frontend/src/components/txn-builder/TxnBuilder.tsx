import { NO_MESSAGES_ILLUSTRATION } from '@/constants/image-names';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import '@/app/(routes)/multiops/multiops.css';
import { TextField } from '@mui/material';
import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import CustomButton from '../common/CustomButton';
import MessagesList from './components/MessagesList';
import SelectMessage from './components/SelectMessage';

const TxnBuilder = ({
  chainID,
  onSubmit,
  loading,
  availableBalance,
  fromAddress,
}: {
  chainID: string;
  onSubmit: (data: TxnBuilderForm) => void;
  loading: boolean;
  availableBalance: number;
  fromAddress: string;
}) => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };
  const { feeAmount } = basicChainInfo;

  const [txType, setTxType] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      gas: 900000,
      memo: '',
      fees: feeAmount * 10 ** currency.coinDecimals,
    },
  });

  const handleSelectMessage = (type: TxnMsgType) => {
    setTxType(type);
  };

  const handleAddMessage = (msg: Msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const onDeleteMsg = (index: number) => {
    const arr = messages.filter((_, i) => i !== index);
    setMessages(arr);
  };

  const clearAllMessages = () => {
    setTxType('');
    setMessages([]);
  };

  const onFormSubmit = (data: { gas: number; memo: string; fees: number }) => {
    onSubmit({
      fees: data.fees,
      gas: data.gas,
      memo: data.memo,
      msgs: messages,
    });
  };

  return (
    <div className="mt-10 h-full overflow-y-scroll flex gap-10">
      <SelectMessage
        handleSelectMessage={handleSelectMessage}
        txType={txType}
        fromAddress={fromAddress}
        handleAddMessage={handleAddMessage}
        currency={currency}
        chainID={chainID}
        availableBalance={availableBalance}
        cancelAddMsg={() => {
          setTxType('');
        }}
      />
      <div className="flex-1 space-y-6 flex flex-col min-h-full h-fit bg-[#FFFFFF05] rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="text-[#FFFFFF80]">Transaction Summary</div>
          {messages?.length ? (
            <div
              className="secondary-btn cursor-pointer"
              onClick={clearAllMessages}
            >
              Clear All
            </div>
          ) : null}
        </div>
        {messages?.length ? (
          <div className="flex-1 flex flex-col gap-6">
            <MessagesList
              currency={currency}
              messages={messages}
              onDeleteMsg={onDeleteMsg}
              chainID={chainID}
            />
            <div className="space-y-6">
              <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
                <div className="space-y-6">
                  <div className="space-y-2 w-full">
                    <div className="text-b1-light">Enter Gas</div>
                    <Controller
                      name="gas"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                          {...field}
                          sx={{
                            ...customMUITextFieldStyles,
                          }}
                          placeholder="Gas"
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
                  <div className="space-y-2 w-full">
                    <div className="text-b1-light">Enter Memo (optional)</div>
                    <Controller
                      name="memo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          className="bg-transparent rounded-full border-[1px] border-[#ffffff80] h-10"
                          {...field}
                          sx={{
                            ...customMUITextFieldStyles,
                          }}
                          placeholder="Memo"
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
                <CustomButton
                  btnText="Create Transaction"
                  btnDisabled={loading}
                  btnLoading={loading}
                  btnType="submit"
                  btnStyles="w-full"
                />
              </form>
            </div>
          </div>
        ) : (
          <div className="h-full flex-1 flex flex-col items-center justify-center opacity-70">
            <Image
              src={NO_MESSAGES_ILLUSTRATION}
              height={130}
              width={195}
              alt="No Messages"
            />
            <div className="text-b1 font-light">
              Select a message to add here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TxnBuilder;
