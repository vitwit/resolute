import { TxnMsgProps } from '@/types/multisig';
import { parseBalance } from '@/utils/denom';
import { shortenAddress } from '@/utils/util';
import React from 'react';

const RedelegateMessage: React.FC<TxnMsgProps> = (props) => {
  const { msg, index, currency, onDelete } = props;
  return (
    <div>
      <div>
        <span>#{index + 1}&nbsp;&nbsp;</span>
        <span>Redelegate&nbsp;</span>
        <span>
          {parseBalance(
            [msg.value.amount],
            currency.coinDecimals,
            currency.coinMinimalDenom
          )}
          {currency.coinDenom}&nbsp;
        </span>
        <span>from&nbsp;</span>
        <span>{shortenAddress(msg.value.validatorSrcAddress, 21)}&nbsp;</span>
        <span>to&nbsp;</span>
        <span>{shortenAddress(msg.value.validatorDstAddress, 21)}</span>
      </div>
      {onDelete ? <span onClick={() => onDelete(index)}>x</span> : null}
    </div>
  );
};

export default RedelegateMessage;
