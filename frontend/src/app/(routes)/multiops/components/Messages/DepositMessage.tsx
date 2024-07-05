import { REMOVE_ICON } from '@/constants/image-names';
import { parseBalance } from '@/utils/denom';
import Image from 'next/image';
import React from 'react';

interface DepositMessageProps {
  msg: Msg;
  onDelete: (index: number) => void;
  index: number;
  currency: Currency;
}

const DepositMessage: React.FC<DepositMessageProps> = (props) => {
  const { msg, index, onDelete, currency } = props;
  return (
    <div className="flex justify-between items-center text-[14px]">
      <div className="flex gap-2">
        <div className="truncate">
          <span>Deposit&nbsp;</span>
          <span className="msg-amount">
            {parseBalance(
              msg.value.amount,
              currency.coinDecimals,
              currency.coinMinimalDenom
            )}
            &nbsp;
            {currency.coinDenom}&nbsp;
          </span>
          <span>&nbsp;on&nbsp;</span>
          <span className="font-extralight">proposal&nbsp;</span>
          <span>#{Number(msg.value.proposalId)}</span>
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

export default DepositMessage;
