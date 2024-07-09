import { ALERT_ICON, NO_MESSAGES_ILLUSTRATION } from '@/constants/image-names';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import '@/app/(routes)/multiops/multiops.css';
import { TextField } from '@mui/material';
import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import CustomButton from '../common/CustomButton';
import MessagesList from './components/MessagesList';
import { DELEGATE_TYPE_URL, SEND_TYPE_URL } from '@/utils/constants';
import { parseBalance } from '@/utils/denom';
import SelectMessage from './components/SelectMessage';
import { DEFAULT_MESSAGES_COUNT } from '@/constants/txn-builder';

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
  const [messagesCount, setMessagesCount] = useState<MessagesCount>(
    DEFAULT_MESSAGES_COUNT
  );
  const [estimatedBalance, setEstimatedBalance] =
    useState<number>(availableBalance);

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
    if (msg.typeUrl === SEND_TYPE_URL) {
      const amount = parseBalance(
        msg.value?.amount,
        currency.coinDecimals,
        currency.coinMinimalDenom
      );
      setEstimatedBalance((prev) => {
        const newBalance = prev - amount;
        return newBalance;
      });
    } else if (msg.typeUrl === DELEGATE_TYPE_URL) {
      const amount = parseBalance(
        [msg.value?.amount],
        currency.coinDecimals,
        currency.coinMinimalDenom
      );
      setEstimatedBalance((prev) => {
        const newBalance = prev - amount;
        return newBalance;
      });
    }
    updateMessagesCount(txType as TxnMsgType, 'increase');
  };

  const onDeleteMsg = (index: number) => {
    const msg = messages[index];
    if (msg.typeUrl === SEND_TYPE_URL) {
      const amount = parseBalance(
        msg.value?.amount,
        currency.coinDecimals,
        currency.coinMinimalDenom
      );
      setEstimatedBalance((prev) => {
        const newBalance = prev + amount;
        return newBalance;
      });
    } else if (msg.typeUrl === DELEGATE_TYPE_URL) {
      const amount = parseBalance(
        [msg.value?.amount],
        currency.coinDecimals,
        currency.coinMinimalDenom
      );
      setEstimatedBalance((prev) => {
        const newBalance = prev + amount;
        return newBalance;
      });
    }
    updateMessagesCount(txType as TxnMsgType, 'decrease');
    const arr = messages.filter((_, i) => i !== index);
    setMessages(arr);
  };

  const updateMessagesCount = (
    key: TxnMsgType,
    action: 'increase' | 'decrease'
  ) => {
    if (!key?.length) {
      return;
    }
    setMessagesCount((prevState) => {
      const newValue =
        action === 'increase' ? prevState[key] + 1 : prevState[key] - 1;

      return {
        ...prevState,
        [key]: newValue >= 0 ? newValue : 0,
      };
    });
  };

  const clearAllMessages = () => {
    setTxType('');
    setEstimatedBalance(availableBalance);
    setMessagesCount(DEFAULT_MESSAGES_COUNT);
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

  useEffect(() => {
    setEstimatedBalance(availableBalance);
  }, [availableBalance]);

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
        messagesCount={messagesCount}
      />
      <div className="flex-1 space-y-6 h-full flex flex-col bg-[#FFFFFF05] rounded-2xl p-6 overflow-y-scroll">
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
            />
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#FFFFFF0A] space-y-4">
                <div className="flex items-center gap-1">
                  <Image
                    src={ALERT_ICON}
                    width={24}
                    height={24}
                    alt="info-icon"
                    draggable={false}
                  />
                  <div className="text-b1 text-[#FFC13C]">Asset Summary</div>
                </div>
                <div className="text-[12px] flex items-center gap-2">
                  <div className="font-bold">
                    {estimatedBalance < 0 ? 0 : estimatedBalance.toFixed(3)}{' '}
                    {currency.coinDenom}
                  </div>
                  <div className="text-[#FFFFFF80]">
                    is the estimated balance after this transaction
                  </div>
                </div>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
                <div className="flex items-center gap-6 w-full">
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
            <div className="text-b1 font-light">No messages yet</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TxnBuilder;
