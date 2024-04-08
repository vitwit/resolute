import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { getLocalTime, getTimeDifference } from '@/utils/dataTime';
import { buildMessages, formattedMsgType } from '@/utils/transaction';
import { shortenName } from '@/utils/util';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import TextCopyField from './TextCopyField';
import RenderFormattedMessage from './RenderFormattedMessage';
import { txRepeatTransaction } from '@/store/features/recent-transactions/recentTransactionsSlice';

const parseTxnData = (txn: ParsedTransaction) => {
  const success = txn.code === 0 ? true : false;
  const messages = txn.messages;
  const txHash = txn.txhash;
  const timeStamp = txn.timestamp;
  return {
    success,
    messages,
    txHash,
    timeStamp,
  };
};

const Transaction = ({
  txn,
  currency,
  basicChainInfo,
}: {
  txn: ParsedTransaction;
  currency: Currency;
  basicChainInfo: BasicChainInfo;
}) => {
  const dispatch = useAppDispatch();
  const { success, messages, txHash, timeStamp } = parseTxnData(txn);
  const formattedMessages = buildMessages(messages);
  const onRepeatTxn = () => {
    dispatch(
      txRepeatTransaction({
        basicChainInfo,
        feegranter: '',
        messages: formattedMessages,
      })
    );
  };
  return (
    <div>
      <div className="flex gap-4">
        <TxnStatus success={success} />
        <TxnData
          txHash={txHash}
          success={success}
          messages={messages}
          timeStamp={timeStamp}
          currency={currency}
          onRepeatTxn={onRepeatTxn}
          enableAction={formattedMessages?.length ? true : false}
        />
      </div>
    </div>
  );
};

export default Transaction;

const TxnStatus = ({ success }: { success: boolean }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-1">
      <Image
        src={`${success ? '/txn-success.svg' : '/txn-failed.svg'}`}
        width={24}
        height={24}
        alt={`${success ? 'Successful' : 'Failed'}`}
      />
      <div className="w-[0.5px] h-[78px] bg-[#FFFFFF80]"></div>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const TxnData = ({
  txHash,
  success,
  messages,
  timeStamp,
  currency,
  onRepeatTxn,
  enableAction,
}: {
  txHash: string;
  success: boolean;
  messages: any[];
  timeStamp: string;
  currency: Currency;
  onRepeatTxn: () => void;
  enableAction: boolean;
}) => {
  return (
    <div className="flex justify-between w-full gap-4 flex-wrap">
      <div className="flex flex-col gap-4">
        <div className="font-extralight text-[14px] text-[#ffffff80] h-[29px] flex items-center w-[500px]">
          {getTimeDifference(timeStamp)} | {getLocalTime(timeStamp)}
        </div>
        <div>
          <RenderFormattedMessage
            message={messages[0]}
            decimals={currency.coinDecimals}
            coinDenom={currency.coinDenom}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[220px]">
        <div className="font-extralight text-[14px] text-[#ffffff80] h-[29px] flex items-center">
          Messages
        </div>
        <div>
          <Messages messages={messages} />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[220px]">
        <div className="font-extralight text-[14px] text-[#ffffff80] h-[29px] flex items-center">
          Txn Hash
        </div>
        <div>
          <TextCopyField content={txHash} displayLen={18} isAddress={false} />
        </div>
      </div>
      <div className={`flex flex-col gap-4 ${enableAction ? '' : 'invisible'}`}>
        <div className="font-extralight text-[14px] text-[#ffffff80] h-[29px] flex items-center">
          Actions
        </div>
        <div className="txn-btn-wrapper">
          <button className="txn-btn w-[144px]" onClick={onRepeatTxn}>
            {success ? 'Repeat Transaction' : 'Retry Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const Messages = ({ messages }: { messages: any[] }) => {
  return (
    <div className="flex gap-4">
      {messages
        ?.slice(0, 2)
        ?.map((message, index) => <Message message={message} key={index} />)}
      <MoreMessages count={messages?.length || 0} />
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const Message = ({ message }: { message: any }) => {
  const msgType = formattedMsgType(message['@type']);
  return (
    <Tooltip title={msgType} placement="top">
      <div className="text-[12px] bg-[#ffffff14] px-4 py-2 rounded-full flex-center-center min-w-[100px] max-w-[100px] truncate">
        {shortenName(msgType, 10)}
      </div>
    </Tooltip>
  );
};

const MoreMessages = ({ count }: { count: number }) => {
  return (
    <div>
      {count > 2 ? (
        <div className="primary-gradient rounded-full p-2 font-bold">
          +{count - 2}
        </div>
      ) : null}
    </div>
  );
};
