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
  const { delegatorAddress, validatorAddress, amount } = msg.value;
  return `$${delegatorAddress} delegated $${amount[0].amount} ${amount[0].denom} to $${validatorAddress}`;
}
