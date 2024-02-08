import { formatNumber, parseDenomAmount, shortenMsg } from '@/utils/util';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { MsgBeginRedelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

export const msgReDelegate = '/cosmos.staking.v1beta1.MsgBeginRedelegate';

export function Redelegate(
  delegator: string,
  sourceAddr: string,
  destinationAddr: string,
  amount: number,
  denom: string
): Msg {
  return {
    typeUrl: msgReDelegate,
    value: MsgBeginRedelegate.fromPartial({
      validatorDstAddress: destinationAddr,
      validatorSrcAddress: sourceAddr,
      delegatorAddress: delegator,
      amount: Coin.fromPartial({
        amount: String(amount),
        denom: denom,
      }),
    }),
  };
}

export function serialize(msg: Msg): string {
  const { delegatorAddress, validatorSrcAddress, validatorDstAddress, amount } =
    msg.value;
  return `${shortenMsg(delegatorAddress, 10)} re-delegated ${
    amount.amount
  } ${amount.denom} to ${shortenMsg(
    validatorDstAddress,
    10
  )} from ${shortenMsg(validatorSrcAddress, 10)}`;
}

export function formattedSerialize(
  msg: Msg,
  decimals: number,
  originalDenom: string,
  pastTense?: boolean
) {
  const { validatorSrcAddress, validatorDstAddress, amount } = msg.value;
  return `${pastTense ? 're-delegated' : 'Re-delegated'} ${formatNumber(
    parseDenomAmount(amount.amount, decimals)
  )} ${originalDenom} to ${shortenMsg(validatorDstAddress, 10)} from ${shortenMsg(
    validatorSrcAddress,
    10
  )}`;
}
