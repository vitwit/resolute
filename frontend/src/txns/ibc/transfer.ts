import { parseBalance } from '@/utils/denom';
import { formatNumber } from '@/utils/util';

export const msgTransfer = '/ibc.applications.transfer.v1.MsgTransfer';

export function serialize(
  msg: any,
  decimals: number,
  originalDenom: string
): string {
  const receiver = msg?.receiver;
  const token = msg?.token;
  const parsedAmount = parseBalance([token], decimals, token?.denom);
  return `Transfer ${formatNumber(parsedAmount)} ${originalDenom} to ${receiver}`;
}
