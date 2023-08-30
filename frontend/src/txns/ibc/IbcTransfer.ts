import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx";
import { Msg } from "../types";

const msgIBCSendTypeUrl: string = "/ibc.applications.transfer.v1.MsgTransfer";

export function IBCTransferMsg(
  from: string,
  to: string,
  amount: number,
  denom: string,
  sourcePort: string,
  sourceChannel: string
): Msg {
  return {
    typeUrl: msgIBCSendTypeUrl,
    value: MsgTransfer.fromPartial({
      sender: from,
      receiver: to,
      token: {
        denom: denom,
        amount: String(amount),
      },
      sourceChannel: sourceChannel,
      sourcePort: sourcePort,
      timeoutHeight: {
        revisionHeight: 2200,
        revisionNumber: 1,
      }
    }),
  };
}
