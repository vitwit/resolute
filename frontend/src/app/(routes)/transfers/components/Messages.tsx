import { Pagination } from '@mui/material';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { paginationComponentStyles } from '../../staking/styles';
import { formatSendMessage } from '@/txns/bank/send';
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
      <div className="flex flex-col h-full">
        <div className="flex justify-between h-[34px] items-center">
          <div className="text-[14px] font-light">Messages</div>
          <div
            className="secondary-btn"
            onClick={() => {
              onDeleteAll();
              setIndex(0);
            }}
          >
            Clear All
          </div>
        </div>
        <div className="flex flex-col gap-2 my-4 h-[91px]">
          {msgs?.length
            ? msgs
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
                  </div>
                ))
            : null}
        </div>
      </div>
      <div className="w-full divider-line !opacity-10"></div>
      <div className="flex flex-row-reverse items-center mt-1 h-6">
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
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-2 items-center">
        <div className="overflowed-text max-w-[350px] text-[14px] font-light flex gap-1 text-[#FFFFFF80]">
          {formatSendMessage(
            msg,
            originDenomInfo.decimals,
            originDenomInfo.originDenom
          )}
        </div>
      </div>
      <Image
        src="/icons/remove-icon.svg"
        className="cursor-pointer"
        width={24}
        height={24}
        alt="cancel"
        onClick={() => onDelete(index)}
      />
    </div>
  );
};

export default Messages;
