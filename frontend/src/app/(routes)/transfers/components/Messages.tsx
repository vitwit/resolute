import { Pagination } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { paginationComponentStyles } from '../../staking/styles';
import { serialize } from '@/txns/bank/send';
import { MULTI_TRANSFER_MSG_COUNT } from '../../../../utils/constants';

const Messages = ({
  msgs,
  onDelete,
  onDeleteAll,
}: {
  msgs: Msg[];
  onDelete: (index: number) => void;
  onDeleteAll: () => void;
}) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full space-y-6 pb-6">
        <div className="flex justify-between">
          <div className="text-sm not-italic font-normal leading-[normal]">
            Messages
          </div>
          <div
            className="text-xs not-italic font-bold leading-[normal] underline cursor-pointer opacity-60"
            onClick={onDeleteAll}
          >
            clear
          </div>
        </div>
        <div className="flex h-full flex-col">
          {msgs
            .slice(
              MULTI_TRANSFER_MSG_COUNT * index,
              MULTI_TRANSFER_MSG_COUNT * index + MULTI_TRANSFER_MSG_COUNT
            )
            .map((msg, offset) => (
              <div key={offset}>
                <Message
                  msg={msg}
                  onDelete={onDelete}
                  index={MULTI_TRANSFER_MSG_COUNT * index + offset}
                />
                
                  <div style={{ marginBottom: '26px' }} />
                
              </div>
            ))}
        </div>
      </div>
      <div className="w-full h-[0.25px] bg-[#6e6d7d]"></div>
      <div className="flex flex-row-reverse mt-3">
        <Pagination
          sx={paginationComponentStyles}
          count={Math.ceil(msgs.length / MULTI_TRANSFER_MSG_COUNT)}
          shape="circular"
          onChange={(_, v) => {
            setIndex(v - 1);
          }}
        />
      </div>
    </div>
  );
};

const Message = ({
  msg,
  onDelete,
  index,
}: {
  index: number;
  msg: Msg;
  onDelete: (index: number) => void;
}) => {

  return (
    <div className="flex items-center justify-between">
      <Image src="/back-arrow.svg" width={24} height={24} alt="msg" />
      <div className="overflowed-text max-w-[250px] text-sm not-italic font-normal leading-[normal]">
        {serialize(msg)}
      </div>
      <Image
        src="/close.svg"
        className='cursor-pointer'
        width={16}
        height={16}
        alt="cancel"
        onClick={() => onDelete(index)}
      />
    </div>
  );
};

export default Messages;
