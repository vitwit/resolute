import { formatNumber, parseDenomAmount } from '@/utils/util';

export const msgTransfer = '/ibc.applications.transfer.v1.MsgTransfer';

export function serialize(msg: Msg): string {
  const { receiver, token } = msg.value;
  return `Transfer ${formatNumber(+token?.amount || 0)} ${token?.denom} to ${receiver}`;
}

export function formattedSerialize(
  msg: Msg,
  decimals: number,
  originalDenom: string,
  pastTense?: boolean
) {
  const { receiver, token } = msg.value;
  return `${pastTense ? 'transfer' : 'Transfer'} ${formatNumber(
    parseDenomAmount(token?.amount || '0', decimals)
  )} ${originalDenom} to ${receiver}`;
}
