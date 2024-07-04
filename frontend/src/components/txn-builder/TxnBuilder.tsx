import { ALERT_ICON, NO_MESSAGES_ILLUSTRATION } from '@/constants/image-names';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import '@/app/(routes)/multiops/multiops.css';
import { TextField } from '@mui/material';
import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import CustomButton from '../common/CustomButton';
import { TXN_BUILDER_MSGS } from '@/constants/txn-builder';
import SectionHeader from '../common/SectionHeader';
import MessagesList from './components/MessagesList';
import SendForm from './messages/SendForm';
import DelegateForm from './messages/DelegateForm';
import { DELEGATE_TYPE_URL, SEND_TYPE_URL } from '@/utils/constants';
import { parseBalance } from '@/utils/denom';
import UndelegateForm from './messages/UndelegateForm';
import RedelegateForm from './messages/RedelegateForm';
import VoteForm from './messages/VoteForm';
import CustomMessageForm from './messages/CustomMessageForm';

type MsgType =
  | 'Send'
  | 'Delegate'
  | 'Undelegate'
  | 'Redelegate'
  | 'Vote'
  | 'Custom';

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
  const [estimatedBalance, setEstimatedBalances] = useState<number>(
    2 || availableBalance || 0
  );

  const {
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      gas: 900000,
      memo: '',
      fees: feeAmount * 10 ** currency.coinDecimals,
    },
  });

  const handleSelectMessage = (type: MsgType) => {
    setTxType(type);
  };

  const handleAddMessage = (msg: Msg) => {
    setMessages([...messages, msg]);
    if (msg.typeUrl === SEND_TYPE_URL) {
      const amount = parseBalance(
        msg.value?.amount,
        currency.coinDecimals,
        currency.coinMinimalDenom
      );
      setEstimatedBalances((prev) => {
        const newBalance = prev - amount;
        return newBalance < 0 ? 0 : newBalance;
      });
    } else if (msg.typeUrl === DELEGATE_TYPE_URL) {
      const amount = parseBalance(
        [msg.value?.amount],
        currency.coinDecimals,
        currency.coinMinimalDenom
      );
      setEstimatedBalances((prev) => {
        const newBalance = prev - amount;
        return newBalance < 0 ? 0 : newBalance;
      });
    }
  };

  const onDeleteMsg = (index: number) => {
    const arr = messages.filter((_, i) => i !== index);
    setMessages(arr);
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
      <div className="flex-1 space-y-6 h-full flex flex-col bg-[#FFFFFF05] rounded-2xl p-6 overflow-y-scroll">
        <div className="flex items-center justify-between">
          <div className="text-[#FFFFFF80]">Transaction Summary</div>
          <div
            className="secondary-btn cursor-pointer"
            onClick={() => setMessages([])}
          >
            Clear All
          </div>
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
                    {estimatedBalance.toFixed(3)} {currency.coinDenom}
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

const SelectMessage = ({
  handleSelectMessage,
  txType,
  handleAddMessage,
  currency,
  chainID,
  fromAddress,
  availableBalance,
  cancelAddMsg,
}: {
  handleSelectMessage: (type: MsgType) => void;
  txType: string;
  handleAddMessage: (msg: Msg) => void;
  currency: Currency;
  chainID: string;
  fromAddress: string;
  availableBalance: number;
  cancelAddMsg: () => void;
}) => {
  return (
    <div className="w-[40%] space-y-6 flex flex-col">
      <div className="space-y-6">
        <SectionHeader
          title="Transaction Messages"
          description="Select and add the transaction messages"
        />
        <div className="flex gap-2 flex-wrap">
          {TXN_BUILDER_MSGS.map((msg) => (
            <button
              key={msg}
              className={`msg-btn ${txType === msg ? 'msg-btn-selected' : ''} `}
              type="button"
              onClick={() => handleSelectMessage(msg as MsgType)}
            >
              {msg}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        {txType === 'Send' && (
          <SendForm
            onSend={handleAddMessage}
            currency={currency}
            fromAddress={fromAddress}
            availableBalance={availableBalance}
            cancelAddMsg={cancelAddMsg}
          />
        )}
        {txType === 'Delegate' && (
          <DelegateForm
            chainID={chainID}
            currency={currency}
            onDelegate={handleAddMessage}
            fromAddress={fromAddress}
            availableBalance={availableBalance}
            cancelAddMsg={cancelAddMsg}
          />
        )}
        {txType === 'Undelegate' && (
          <UndelegateForm
            chainID={chainID}
            currency={currency}
            fromAddress={fromAddress}
            onUndelegate={handleAddMessage}
            cancelAddMsg={cancelAddMsg}
          />
        )}
        {txType === 'Redelegate' && (
          <RedelegateForm
            chainID={chainID}
            currency={currency}
            fromAddress={fromAddress}
            onReDelegate={handleAddMessage}
            cancelAddMsg={cancelAddMsg}
          />
        )}
        {txType === 'Vote' && (
          <VoteForm
            chainID={chainID}
            fromAddress={fromAddress}
            onVote={handleAddMessage}
            cancelAddMsg={cancelAddMsg}
          />
        )}
        {txType === 'Custom' && (
          <CustomMessageForm
            onAddMsg={handleAddMessage}
            cancelAddMsg={cancelAddMsg}
          />
        )}
      </div>
    </div>
  );
};
