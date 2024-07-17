import useGetAllAssets from '@/custom-hooks/multisig/useGetAllAssets';
import {
  DELEGATE_TYPE_URL,
  MAP_TXNS,
  REDELEGATE_TYPE_URL,
  SEND_TYPE_URL,
  UNDELEGATE_TYPE_URL,
  VOTE_TYPE_URL,
} from '@/utils/constants';
import { parseTokens } from '@/utils/denom';
import { shortenAddress } from '@/utils/util';
import React from 'react';

interface TxnMsg {
  msg: Msg;
  currency: Currency;
  chainID: string;
}

const voteOptions: Record<string, string> = {
  '1': 'Yes',
  '2': 'Abstain',
  '3': 'No',
  '4': 'No With Veto',
};

const TxnMsg: React.FC<TxnMsg> = (props) => {
  const { msg, currency, chainID } = props;
  const { getParsedAsset } = useGetAllAssets();

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

  const renderMessage = () => {
    switch (msg?.typeUrl) {
      case SEND_TYPE_URL:
        const { assetInfo } = getParsedAsset({
          amount: msg.value?.amount?.[0]?.amount,
          chainID,
          denom: msg.value?.amount?.[0]?.denom,
        });
        return (
          <p>
            <span className="font-bold">{MAP_TXNS[msg?.typeUrl]}</span> &nbsp;
            <span>
              {assetInfo.amountInDenom} {assetInfo.displayDenom}
            </span>
            &nbsp;To&nbsp;
            <span>{shortenAddress(msg?.value?.toAddress, 20)}</span>
          </p>
        );

      case DELEGATE_TYPE_URL:
        return (
          <p>
            <span className="font-bold">{MAP_TXNS[msg?.typeUrl]}</span>{' '}
            <span>{displayDenom(msg?.value?.amount)}</span>
            &nbsp; To &nbsp;
            <span>{shortenAddress(msg?.value?.validatorAddress, 20)}</span>
          </p>
        );

      case UNDELEGATE_TYPE_URL:
        return (
          <p>
            <span className="font-bold">{MAP_TXNS[msg?.typeUrl]}</span>{' '}
            <span>{displayDenom(msg?.value?.amount)}</span>
            &nbsp; From &nbsp;
            <span>{shortenAddress(msg?.value?.validatorAddress, 20)}</span>
          </p>
        );

      case REDELEGATE_TYPE_URL:
        return (
          <p>
            <span className="font-bold">{MAP_TXNS[msg?.typeUrl]}</span>{' '}
            <span>{displayDenom(msg?.value?.amount)}</span>
            &nbsp; From &nbsp;
            <span>{shortenAddress(msg?.value?.validatorSrcAddress, 20)}</span>
            &nbsp; To &nbsp;
            <span>{shortenAddress(msg?.value?.validatorDstAddress, 20)}</span>
          </p>
        );

      case VOTE_TYPE_URL:
        return (
          <p>
            <span className="font-bold">{MAP_TXNS[msg?.typeUrl]}</span>{' '}
            <span>{voteOptions?.[msg.value.option.toString()]}</span>
            &nbsp;on proposal&nbsp;
            <span>#{msg.value.proposalId}</span>
          </p>
        );

      default:
        return <div className="font-bold">{msg?.typeUrl}</div>;
    }
  };

  return (
    <div className="w-[320px] truncate">
      {msg ? <div className="text-b1">{renderMessage()}</div> : null}
    </div>
  );
};

export default TxnMsg;
