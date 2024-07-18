import {
  DELEGATE_TYPE_URL,
  DEPOSIT_TYPE_URL,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
  VOTE_TYPE_URL,
} from '@/utils/constants';
import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { paginationComponentStyles } from '../../staking/styles';
import SendMessage from './Messages/SendMessage';
import DelegateMessage from './Messages/DelegateMessage';
import UndelegateMessage from './Messages/UndelegateMessage';
import RedelegateMessage from './Messages/RedelegateMessage';
import VoteMessage from './Messages/VoteMessage';
import DepositMessage from './Messages/DepositMessage';

const PER_PAGE = 5;

const renderMessage = (
  msg: Msg,
  index: number,
  currency: Currency,
  onDelete: (index: number) => void,
  chainID: string
) => {
  switch (msg.typeUrl) {
    case SEND_TYPE_URL:
      return SendMessage({ msg, index, currency, onDelete, chainID });
    case DELEGATE_TYPE_URL:
      return DelegateMessage({ msg, index, currency, onDelete });
    case UNDELEGATE_TYPE_URL:
      return UndelegateMessage({ msg, index, currency, onDelete });
    case REDELEGATE_TYPE_URL:
      return RedelegateMessage({ msg, index, currency, onDelete });
    case VOTE_TYPE_URL:
      return VoteMessage({ msg, index, onDelete });
    case DEPOSIT_TYPE_URL:
      return DepositMessage({ msg, index, currency, onDelete });
    default:
      return '';
  }
};

const MessagesList = ({
  messages,
  currency,
  onDeleteMsg,
  chainID,
}: {
  messages: Msg[];
  currency: Currency;
  onDeleteMsg: (index: number) => void;
  chainID: string;
}) => {
  const [slicedMsgs, setSlicedMsgs] = useState<Msg[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (messages.length < PER_PAGE) {
      setSlicedMsgs(messages);
    } else {
      const page = Math.ceil(messages.length / PER_PAGE);
      setCurrentPage(page);
      setSlicedMsgs(
        messages?.slice(
          (page - 1) * PER_PAGE,
          (page - 1) * PER_PAGE + 1 * PER_PAGE
        )
      );
    }
  }, [messages]);

  return (
    <div className="flex flex-col justify-between gap-6">
      <div>
        <div className="space-y-4 py-4 border-b-[0.5px] border-[#ffffff2e] min-h-[212px]">
          {slicedMsgs.map((msg, index) => {
            return (
              <div key={index + PER_PAGE * (currentPage - 1)}>
                {renderMessage(
                  msg,
                  index + PER_PAGE * (currentPage - 1),
                  currency,
                  onDeleteMsg,
                  chainID
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
            page={currentPage}
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
