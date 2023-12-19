export const msgTransfer = '/ibc.applications.transfer.v1.MsgTransfer';

export function serialize(msg: Msg): string {
  const { receiver, token } = msg.value;
  return `Transfer ${token?.amount} ${token?.denom} to ${receiver}`;
}
