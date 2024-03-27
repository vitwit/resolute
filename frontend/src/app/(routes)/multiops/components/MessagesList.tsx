import {
  DELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
} from '@/utils/constants';
import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { paginationComponentStyles } from '../../staking/styles';
import SendMessage from './Messages/SendMessage';
import DelegateMessage from './Messages/DelegateMessage';
import UndelegateMessage from './Messages/UndelegateMessage';

const PER_PAGE = 4;

const renderMessage = (
  msg: Msg,
  index: number,
  currency: Currency,
  onDelete: (index: number) => void
) => {
  switch (msg.typeUrl) {
    case SEND_TYPE_URL:
      return SendMessage({ msg, index, currency, onDelete });
    case DELEGATE_TYPE_URL:
      return DelegateMessage({ msg, index, currency, onDelete });
    case UNDELEGATE_TYPE_URL:
      return UndelegateMessage({ msg, index, currency, onDelete });
    default:
      return '';
  }
};

const MessagesList = ({
  messages,
  currency,
  onDeleteMsg,
}: {
  messages: Msg[];
  currency: Currency;
  onDeleteMsg: (index: number) => void;
}) => {
  const [slicedMsgs, setSlicedMsgs] = useState<Msg[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (messages.length < PER_PAGE) {
      setSlicedMsgs(messages);
    } else {
      setCurrentPage(1);
      setSlicedMsgs(messages?.slice(0, 1 * PER_PAGE));
    }
  }, [messages]);
  return (
    <div className="flex flex-col justify-between gap-6">
      <div>
        <div className="space-y-4 py-4 border-b-[0.5px] border-[#ffffff2e] min-h-[174px]">
          {slicedMsgs.map((msg, index) => {
            return (
              <div key={index + PER_PAGE * (currentPage - 1)}>
                {renderMessage(
                  msg,
                  index + PER_PAGE * (currentPage - 1),
                  currency,
                  onDeleteMsg
                )}
              </div>
            );
          })}
        </div>

        <div
          className={
            messages.length > PER_PAGE
              ? 'mt-2 flex justify-end opacity-100'
              : 'mt-2 flex justify-end opacity-0'
          }
        >
          <Pagination
            sx={paginationComponentStyles}
            count={Math.ceil(messages.length / PER_PAGE)}
            shape="circular"
            onChange={(_, v) => {
              setCurrentPage(v);
              setSlicedMsgs(messages?.slice((v - 1) * PER_PAGE, v * PER_PAGE));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MessagesList;
