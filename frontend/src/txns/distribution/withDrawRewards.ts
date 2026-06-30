import { shortenMsg } from '@/utils/util';
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

export function EncodedWithdrawAllRewardsMsg(
  delegator: string,
  validator: string
): Msg {
  return {
    typeUrl: msgWithdrawRewards,
    value: MsgWithdrawDelegatorReward.encode({
      delegatorAddress: delegator,
      validatorAddress: validator,
    }).finish(),
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function serialize(msg: any): string {
  const validatorAddress = msg?.validator_address;
  return `Withdrew rewards from ${shortenMsg(validatorAddress, 10)}`;
}
