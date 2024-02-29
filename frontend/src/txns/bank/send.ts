import { parseBalance } from '@/utils/denom';
import { formatNumber } from '@/utils/util';
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
  const { toAddress, amount } = msg.value;
  return `Sent ${amount[0].amount} ${amount[0].denom} to ${toAddress}`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function formattedSerialize(
  msg: any,
  decimals: number,
  originalDenom: string,
  pastTense?: boolean
) {
  const { to_address, amount } = msg;
  const parsedAmount = parseBalance(amount, decimals, amount[0].denom);
  return `${pastTense ? 'Sent' : 'Send'} ${formatNumber(
    parsedAmount
  )} ${originalDenom} to ${to_address}`;
}

export function formatSendMessage(
  msg: Msg,
  decimals: number,
  originalDenom: string,
  pastTense?: boolean
) {
  const { toAddress, amount } = msg.value;
  const parsedAmount = parseBalance(amount, decimals, amount[0].denom);
  return `${pastTense ? 'Sent' : 'Send'} ${formatNumber(
    parsedAmount
  )} ${originalDenom} to ${toAddress}`;
}
