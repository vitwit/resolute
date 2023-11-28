import { shortenMsg } from '@/utils/util';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
export const msgSendTypeUrl: string = '/cosmos.bank.v1beta1.MsgSend';

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

export function serialize(msg: Msg): string {
  const { fromAddress, toAddress, amount } = msg.value;
  return `${shortenMsg(fromAddress, 10)} sent ${amount[0].amount} ${
    amount[0].denom
  } to ${shortenMsg(toAddress, 10)}`;
}
