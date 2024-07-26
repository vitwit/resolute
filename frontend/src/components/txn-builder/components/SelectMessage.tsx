import SectionHeader from '@/components/common/SectionHeader';
import { TXN_BUILDER_MSGS } from '@/constants/txn-builder';
import React from 'react';
import SendForm from '../messages/SendForm';
import DelegateForm from '../messages/DelegateForm';
import UndelegateForm from '../messages/UndelegateForm';
import RedelegateForm from '../messages/RedelegateForm';
import VoteForm from '../messages/VoteForm';
import CustomMessageForm from '../messages/CustomMessageForm';

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
  handleSelectMessage: (type: TxnMsgType) => void;
  txType: string;
  handleAddMessage: (msg: Msg) => void;
  currency: Currency;
  chainID: string;
  fromAddress: string;
  availableBalance: number;
  cancelAddMsg: () => void;
}) => {
  return (
    <div className="w-[40%] space-y-6 flex flex-col pb-6 h-full">
      <div className="space-y-6">
        <SectionHeader
          title="Transaction Messages"
          description="Select and add the transaction messages you want to include"
        />
        <div className="flex gap-x-3 gap-y-3 flex-wrap">
          {TXN_BUILDER_MSGS.map((msg: TxnMsgType) => (
            <button
              key={msg}
              className={`msg-btn ${txType === msg ? 'msg-btn-selected' : ''} `}
              type="button"
              onClick={() => handleSelectMessage(msg as TxnMsgType)}
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
            chainID={chainID}
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

export default SelectMessage;
