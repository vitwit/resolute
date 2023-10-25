import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { MsgCreateVestingAccount } from "cosmjs-types/cosmos/vesting/v1beta1/tx";
import { Msg } from "../types";
import { coins } from "@cosmjs/proto-signing";
import Long from "long";

const msgCreateVestingAccount =
  "/cosmos.vesting.v1beta1.MsgCreateVestingAccount";

export function CreateVestingAccount(
  fromAddress: string,
  toAddress: string,
  amount: number,
  denom: string,
  endTime: Long,
  delayed: boolean
): Msg {
  return {
    typeUrl: msgCreateVestingAccount,
    value: MsgCreateVestingAccount.fromPartial({
      fromAddress: fromAddress,
      toAddress: toAddress,
      amount: coins(amount, denom),
      endTime: Long.fromString(endTime.toString()),
      delayed: delayed,
    }),
  };
}
