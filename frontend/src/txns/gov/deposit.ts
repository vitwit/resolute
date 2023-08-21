import { MsgDeposit } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { Msg } from "../types";

const msgDeposit = "/cosmos.gov.v1beta1.MsgDeposit";

export function GovVoteMsg(
  proposalId: number,
  depositer: string,
  amount: number,
  denom: string
): Msg {
  return {
    typeUrl: msgDeposit,
    value: MsgDeposit.fromPartial({
      depositor: depositer,
      proposalId: proposalId,
      amount: [
        {
          denom: denom,
          amount: String(amount),
        },
      ],
    }),
  };
}
