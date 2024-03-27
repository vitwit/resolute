import { TxnMsgProps } from '@/types/multisig';
import { parseBalance } from '@/utils/denom';
import Image from 'next/image';
import React from 'react';

const UndelegateMessage: React.FC<TxnMsgProps> = (props) => {
  const { msg, index, currency, onDelete } = props;
  return (
    <div className="flex justify-between items-center text-[14px]">
      <div className="flex gap-2">
        <Image
          className="bg-[#FFFFFF1A] rounded-lg"
          src="/solid-arrow-icon.svg"
          height={24}
          width={24}
          alt="arrow-icon"
          draggable={false}
        />
        <div className="truncate">
          <span>UnDelegate&nbsp;</span>
          <span className="msg-amount">
            {parseBalance(
              [msg.value.amount],
              currency.coinDecimals,
              currency.coinMinimalDenom
            )}
            &nbsp;
            {currency.coinDenom}&nbsp;
          </span>
          <span>from&nbsp;</span>
          <span className="font-extralight">{msg.value.validatorAddress}</span>
        </div>
      </div>
      {onDelete ? (
        <span className="cursor-pointer" onClick={() => onDelete(index)}>
          <Image
            src="/delete-cross-icon.svg"
            height={16}
            width={16}
            alt="Remove"
            draggable={false}
          />
        </span>
      ) : null}
    </div>
  );
};

export default UndelegateMessage;
