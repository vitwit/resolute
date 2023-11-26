import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';

export const msgWithdrawRewards =
  '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward';

export function WithdrawAllRewardsMsg(
  delegator: string,
  validator: string
): Msg {
  return {
    typeUrl: msgWithdrawRewards,
    value: MsgWithdrawDelegatorReward.fromPartial({
      delegatorAddress: delegator,
      validatorAddress: validator,
    }),
  };
}

export function serialize(msg: Msg): string {
  const { delegatorAddress, validatorAddress } = msg.value;
  return `$${delegatorAddress} withdrew rewards from ${validatorAddress}`;
}
