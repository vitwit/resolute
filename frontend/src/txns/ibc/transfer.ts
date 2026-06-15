import { formatNumber, parseDenomAmount } from '@/utils/util';

export const msgTransfer = '/ibc.applications.transfer.v1.MsgTransfer';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function serialize(
  msg: any,
  decimals: number,
  originalDenom: string
): string {
  const receiver = msg?.receiver;
  const token = msg?.token;
  return `Transfer ${formatNumber(
    parseDenomAmount(token?.amount || '0', decimals)
  )} ${originalDenom} to ${receiver}`;
}
