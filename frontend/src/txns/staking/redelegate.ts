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

/* eslint-disable @typescript-eslint/no-explicit-any */
export function serialize(
  msg: any,
  decimals: number,
  originalDenom: string
): string {
  const {
    validator_src_address = '',
    validator_dst_address = '',
    amount,
  } = msg;
  return `Re-delegated ${formatNumber(
    parseDenomAmount(amount.amount, decimals)
  )} ${originalDenom} to ${shortenMsg(validator_dst_address, 10)} from ${shortenMsg(
    validator_src_address,
    10
  )}`;
}
