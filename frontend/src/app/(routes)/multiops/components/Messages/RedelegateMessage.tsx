import { REMOVE_ICON } from '@/constants/image-names';
import { TxnMsgProps } from '@/types/multisig';
import { parseBalance } from '@/utils/denom';
import { shortenName } from '@/utils/util';
import Image from 'next/image';
import React from 'react';

const RedelegateMessage: React.FC<TxnMsgProps> = (props) => {
  const { msg, index, currency, onDelete } = props;
  return (
    <div className="flex justify-between items-center text-[14px]">
      <div className="flex gap-2">
        <div className="truncate">
          <span>ReDelegate&nbsp;</span>
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
          <span className="font-extralight">
            {shortenName(msg.value.validatorSrcAddress, 21)}&nbsp;
          </span>
          <span>to&nbsp;</span>
          <span className="font-extralight">
            {shortenName(msg.value.validatorDstAddress, 21)}
          </span>
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

export default RedelegateMessage;
