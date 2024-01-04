import { formatAmount, shortenMsg } from '@/utils/util';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

export const msgDelegate = '/cosmos.staking.v1beta1.MsgDelegate';

export function Delegate(
  delegator: string,
  validator: string,
  amount: number,
  denom: string
): Msg {
  return {
    typeUrl: msgDelegate,
    value: MsgDelegate.fromPartial({
      delegatorAddress: delegator,
      validatorAddress: validator,
      amount: Coin.fromPartial({
        amount: String(amount),
        denom: denom,
      }),
    }),
  };
}

export function serialize(msg: Msg): string {
  const delegatorAddress = msg.value.delegatorAddress;
  const validatorAddress = msg.value.validatorAddress;
  const amount = msg.value.amount;
  return `${shortenMsg(delegatorAddress, 10)} delegated ${formatAmount(
    +amount?.amount || 0
  )} ${amount.denom} to ${shortenMsg(validatorAddress, 10)}`;
}
