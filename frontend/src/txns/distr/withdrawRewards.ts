import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import { Msg } from "../types";

const msgWithdrawRewards =
  "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";

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
