import { REMOVE_ICON } from '@/constants/image-names';
import { TxnMsgProps } from '@/types/multisig';
import { parseBalance } from '@/utils/denom';
import Image from 'next/image';
import React from 'react';

const UndelegateMessage: React.FC<TxnMsgProps> = (props) => {
  const { msg, index, currency, onDelete } = props;
  return (
    <div className="flex justify-between items-center text-[14px]">
      <div className="flex gap-2">
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
            src={REMOVE_ICON}
            height={24}
            width={24}
            alt="Remove"
            draggable={false}
          />
        </span>
      ) : null}
    </div>
  );
};

export default UndelegateMessage;
