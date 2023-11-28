import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { MsgUndelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

export const msgUnDelegate = '/cosmos.staking.v1beta1.MsgUndelegate';

export function UnDelegate(
  delegator: string,
  validator: string,
  amount: number,
  denom: string
): Msg {
  return {
    typeUrl: msgUnDelegate,
    value: MsgUndelegate.fromPartial({
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
  return `$${delegatorAddress} un-delegated $${amount[0].amount} ${amount[0].denom}from ${validatorAddress}`;
}
