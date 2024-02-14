import { shortenMsg } from '@/utils/util';
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

export function serialize(msg: any): string {
  const { delegator_address, validator_address, amount } = msg;
  return `${shortenMsg(
    delegator_address,
    10
  )} un-delegated ${amount?.amount} ${amount?.denom} from ${shortenMsg(
    validator_address,
    10
  )}`;
}
