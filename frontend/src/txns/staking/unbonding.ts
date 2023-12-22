import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { MsgCancelUnbondingDelegation } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

export const msgUnbonding = '/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation';

export function Unbonding(
  delegator: string,
  validator: string,
  amount: number,
  denom: string,
  creationHeight: string,
): Msg {
  return {
    typeUrl: msgUnbonding,
    value: MsgCancelUnbondingDelegation.fromPartial({
      delegatorAddress: delegator,
      validatorAddress: validator,
      amount: Coin.fromPartial({
        amount: String(amount),
        denom: denom,
      }),
      creationHeight: BigInt(creationHeight),
    }),
  };
}
