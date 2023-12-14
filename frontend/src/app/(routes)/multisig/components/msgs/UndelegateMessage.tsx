import { TxnMsgProps } from '@/types/multisig';
import { parseBalance } from '@/utils/denom';
import { shortenAddress } from '@/utils/util';
import React from 'react';

const UndelegateMessage: React.FC<TxnMsgProps> = (props) => {
  const { msg, index, currency, onDelete } = props;
  return (
    <div>
      <div>
        <span>#{index + 1}&nbsp;&nbsp;</span>
        <span>Undelegate&nbsp;</span>
        <span>
          {parseBalance(
            [msg.value.amount],
            currency.coinDecimals,
            currency.coinMinimalDenom
          )}
          {currency.coinDenom}&nbsp;
        </span>
        <span>from&nbsp;</span>
        <span>{shortenAddress(msg.value?.validatorAddress || '', 21)}</span>
      </div>
      {onDelete ? <span onClick={() => onDelete(index)}>x</span> : null}
    </div>
  );
};

export default UndelegateMessage;
