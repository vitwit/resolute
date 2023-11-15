import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
const msgSendTypeUrl: string = "/cosmos.bank.v1beta1.MsgSend";

export function SendMsg(
  from: string,
  to: string,
  amount: number,
  denom: string
): Msg {
  return {
    typeUrl: msgSendTypeUrl,
    value: MsgSend.fromPartial({
      fromAddress: from,
      toAddress: to,
      amount: [
        {
          denom: denom,
          amount: String(amount),
        },
      ],
    }),
  };
}
