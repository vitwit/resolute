import DelegateMessage from '@/app/(routes)/multiops/components/Messages/DelegateMessage';
import DepositMessage from '@/app/(routes)/multiops/components/Messages/DepositMessage';
import RedelegateMessage from '@/app/(routes)/multiops/components/Messages/RedelegateMessage';
import SendMessage from '@/app/(routes)/multiops/components/Messages/SendMessage';
import UndelegateMessage from '@/app/(routes)/multiops/components/Messages/UndelegateMessage';
import VoteMessage from '@/app/(routes)/multiops/components/Messages/VoteMessage';
import { paginationComponentStyles } from '@/app/(routes)/staking/styles';
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

const PER_PAGE = 7;

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
    case REDELEGATE_TYPE_URL:
      return RedelegateMessage({ msg, index, currency, onDelete });
    case VOTE_TYPE_URL:
      return VoteMessage({ msg, index, onDelete });
    case DEPOSIT_TYPE_URL:
      return DepositMessage({ msg, index, currency, onDelete });
    default:
      return (
        <>
          {msg?.typeUrl ? (
            <div className="text-[14px]">{msg?.typeUrl}</div>
          ) : null}
        </>
      );
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
    <div className="flex-1 flex flex-col gap-2">
      <div className="space-y-4 border-b-[0.5px] border-[#ffffff2e] min-h-[300px]">
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
          page={currentPage}
          onChange={(_, v) => {
            setCurrentPage(v);
            setSlicedMsgs(messages?.slice((v - 1) * PER_PAGE, v * PER_PAGE));
          }}
        />
      </div>
    </div>
  );
};

export default MessagesList;
