import { TxnMsgProps } from '@/types/multisig';
import { parseBalance } from '@/utils/denom';
import { shortenAddress } from '@/utils/util';
import Image from 'next/image';
import React from 'react';

const UndelegateMessage: React.FC<TxnMsgProps> = (props) => {
  const { msg, index, currency, onDelete } = props;
  return (
    <div className="flex justify-between items-center text-[14px] font-extralight">
      <div className="flex gap-2">
        <Image
          className="bg-[#FFFFFF1A] rounded-lg"
          src="/solid-arrow-icon.svg"
          height={24}
          width={24}
          alt="arrow-icon"
        />
        <div className="truncate max-w-[280px]">
          <span>UnDelegate&nbsp;</span>
          <span>
            {parseBalance(
              [msg.value.amount],
              currency.coinDecimals,
              currency.coinMinimalDenom
            )}
            &nbsp;
            {currency.coinDenom}&nbsp;
          </span>
          <span>to&nbsp;</span>
          <span>{shortenAddress(msg.value.validatorAddress, 21)}</span>
        </div>
      </div>
      {onDelete ? (
        <span className="cursor-pointer" onClick={() => onDelete(index)}>
          <Image
            src="/delete-cross-icon.svg"
            height={16}
            width={16}
            alt="Remove"
          />
        </span>
      ) : null}
    </div>
  );
};

export default UndelegateMessage;
