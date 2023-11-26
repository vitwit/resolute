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
  return `$${delegatorAddress} re-delegated $${amount[0].amount} ${amount[0].denom} to $${validatorDstAddress} from ${validatorSrcAddress}`;
}
