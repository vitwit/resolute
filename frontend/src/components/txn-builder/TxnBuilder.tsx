import {
  ALERT_ICON,
  I_ICON,
  NO_MESSAGES_ILLUSTRATION,
} from '@/constants/image-names';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
  UseFormSetValue,
} from 'react-hook-form';
import '@/app/(routes)/multiops/multiops.css';
import { TextField } from '@mui/material';
import { customMUITextFieldStyles } from '@/app/(routes)/multiops/styles';
import SendMessage from './messages/SendMessage';
import CustomButton from '../common/CustomButton';
import DelegateMessage from './messages/DelegateMessage';
import UndelegateMessage from './messages/UndelegateMessage';
import RedelegateMessage from './messages/RedelegateMessage';
import VoteMessage from './messages/VoteMessage';
import CustomMessage from './messages/CustomMessage';
import { TXN_BUILDER_MSGS } from '@/constants/txn-builder';
import SectionHeader from '../common/SectionHeader';
import MessagesList from './components/MessagesList';
import SendForm from './messages/SendForm';

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
  address,
}: {
  chainID: string;
  onSubmit: (data: TxnBuilderForm) => void;
  loading: boolean;
  address: string;
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

  const [txType, setTxType] = useState('Send');
  const [messages, setMessages] = useState<Msg[]>([]);

  const {
    handleSubmit,
    control,
    reset: resetForm,
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
        address={address}
        handleAddMessage={handleAddMessage}
        currency={currency}
      />
      <div className="flex-1 space-y-6 h-full flex flex-col bg-[#FFFFFF05] rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>Transaction Summary</div>
          <div className="secondary-btn cursor-pointer">Clear All</div>
        </div>
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
                <div className="font-bold">200 AKT</div>
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
              <button className="primary-btn w-full">Create Transaction</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TxnBuilder;

const SelectMessage = ({
  handleSelectMessage,
  txType,
  address,
  handleAddMessage,
  currency,
}: {
  handleSelectMessage: (type: MsgType) => void;
  txType: string;
  address: string;
  handleAddMessage: (msg: Msg) => void;
  currency: Currency;
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
              className="msg-btn"
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
            address={address}
            onSend={(payload) => {
              handleAddMessage(payload);
            }}
            currency={currency}
          />
        )}
        {/* {txType === 'Delegate' && (
            <DelegateMessage
              control={control}
              index={index}
              remove={remove}
              setValue={setValue}
              chainID={chainID}
            />
          )}
          {txType === 'Undelegate' && (
            <UndelegateMessage
              control={control}
              index={index}
              remove={remove}
              setValue={setValue}
              chainID={chainID}
            />
          )}
          {txType === 'Redelegate' && (
            <RedelegateMessage
              control={control}
              index={index}
              remove={remove}
              setValue={setValue}
              chainID={chainID}
            />
          )}
          {txType === 'Vote' && (
            <VoteMessage
              index={index}
              remove={remove}
              setValue={setValue}
              chainID={chainID}
            />
          )}
          {txType === 'Custom' && (
            <CustomMessage control={control} index={index} remove={remove} />
          )} */}
      </div>
    </div>
  );
};
