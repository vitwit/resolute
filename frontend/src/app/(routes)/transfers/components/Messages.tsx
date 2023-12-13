import { Pagination } from '@mui/material';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { paginationComponentStyles } from '../../staking/styles';
import { formattedSerialize } from '@/txns/bank/send';
import { MULTI_TRANSFER_MSG_COUNT } from '../../../../utils/constants';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';

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
  const pagesCount = useMemo(() => {
    const pages = Math.ceil(msgs.length / MULTI_TRANSFER_MSG_COUNT);
    if (index >= pages) setIndex(Math.max(pages - 1, 0));
    return pages;
  }, [msgs]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full space-y-6">
        <div className="flex justify-between ">
          <div className="text-sm not-italic font-normal leading-[normal]">
            Messages
          </div>
          <div
            className="text-right text-xs not-italic font-normal leading-[normal] underline cursor-pointer"
            onClick={() => {
              onDeleteAll();
              setIndex(0);
            }}
          >
            Clear All
          </div>
        </div>
        <div className="flex h-full flex-col relative">
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

                <div style={{ marginTop: `50px` }} />
              </div>
            ))}
        </div>
      </div>
      <div className="w-full h-[0.25px] bg-[#6e6d7d] opacity-30"></div>
      <div className="flex flex-row-reverse mt-6 h-10 items-center">
        {pagesCount > 1 ? (
          <Pagination
            page={index + 1}
            sx={paginationComponentStyles}
            count={pagesCount}
            shape="circular"
            onChange={(_, v) => {
              setIndex(v - 1);
            }}
          />
        ) : null}
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
  const { getOriginDenomInfo } = useGetChainInfo();
  const originDenomInfo = getOriginDenomInfo(
    msg.value?.amount?.[0]?.denom || ''
  );

  return (
    <div className={`flex items-center justify-between w-full absolute`}>
      <div className="flex gap-1 items-center">
        <Image src="/back-arrow.svg" width={24} height={24} alt="msg" />
        <div className="overflowed-text max-w-[275px] text-sm not-italic font-normal leading-[normal]">
          {formattedSerialize(
            msg,
            originDenomInfo.decimals,
            originDenomInfo.originDenom
          )}
        </div>
      </div>
      <Image
        src="/close.svg"
        className="cursor-pointer"
        width={16}
        height={16}
        alt="cancel"
        onClick={() => onDelete(index)}
      />
    </div>
  );
};

export default Messages;
