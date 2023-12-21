import { formatNumber } from "@/utils/util";

export const msgTransfer = '/ibc.applications.transfer.v1.MsgTransfer';

export function serialize(msg: Msg): string {
  const { receiver, token } = msg.value;
  return `Transfer ${formatNumber(+token?.amount || 0)} ${token?.denom} to ${receiver}`;
}
