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
  console.log(msg)
  return (
    <div className="flex justify-between items-center text-[14px]">
      <div className="flex gap-2">
        <Image
          className="bg-[#FFFFFF1A] rounded-lg"
          src="/solid-arrow-icon.svg"
          height={24}
          width={24}
          alt={index.toString()}
          draggable={false}
        />
        <div className="truncate max-w-[280px]">
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

export default DepositMessage;
