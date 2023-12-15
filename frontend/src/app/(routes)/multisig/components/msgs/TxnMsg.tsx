import {
  DELEGATE_TYPE_URL,
  MAP_TXNS,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
} from '@/utils/constants';
import { parseTokens } from '@/utils/denom';
import { shortenAddress } from '@/utils/util';
import React from 'react';

interface TxnMsg {
  msg: Msg;
  currency: Currency;
}

const TxnMsg: React.FC<TxnMsg> = (props) => {
  const { msg, currency } = props;

  const displayDenom = (amountObj: Coin[] | Coin) => {
    if (Array.isArray(amountObj)) {
      return parseTokens(amountObj, currency.coinDenom, currency.coinDecimals);
    } else {
      return parseTokens(
        [amountObj],
        currency.coinDenom,
        currency.coinDecimals
      );
    }
  };
  return (
    <div>
      {msg ? (
        <div>
          {msg.typeUrl === SEND_TYPE_URL ? (
            <p>
              <span className="font-bold">{MAP_TXNS[msg?.typeUrl]}</span> &nbsp;
              <span>{displayDenom(msg?.value?.amount)}</span>
              &nbsp;To&nbsp;{' '}
              <span> {shortenAddress(msg?.value?.toAddress, 20)}</span>
            </p>
          ) : null}

          {msg.typeUrl === DELEGATE_TYPE_URL ? (
            <p>
              <span className="font-bold">{MAP_TXNS[msg?.typeUrl]}</span>{' '}
              <span>{displayDenom(msg?.value?.amount)}</span>
              &nbsp; To &nbsp;
              <span>{shortenAddress(msg?.value?.validatorAddress, 20)}</span>
            </p>
          ) : null}

          {msg.typeUrl === UNDELEGATE_TYPE_URL ? (
            <p>
              <span className="font-bold">{MAP_TXNS[msg?.typeUrl]}</span>{' '}
              <span>{displayDenom(msg?.value?.amount)}</span>
              &nbsp; From &nbsp;
              <span>{shortenAddress(msg?.value?.validatorAddress, 20)}</span>
            </p>
          ) : null}

          {msg.typeUrl === REDELEGATE_TYPE_URL ? (
            <p>
              <span className="font-bold">{MAP_TXNS[msg?.typeUrl]}</span>{' '}
              <span>{displayDenom(msg?.value?.amount)}</span>
              &nbsp;
              <br />
              From &nbsp;
              <span>{shortenAddress(msg?.value?.validatorSrcAddress, 20)}</span>
              &nbsp; To &nbsp;
              <span>{shortenAddress(msg?.value?.validatorDstAddress, 20)}</span>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default TxnMsg;
