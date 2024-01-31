import { getTypeURLName } from './util';

export function getMsgNamesFromAllowance(allowance: Allowance): string[] {
  switch (allowance.allowance['@type']) {
    case '/cosmos.feegrant.v1beta1.BasicAllowance':
      return ['All Transactions'];
    case '/cosmos.feegrant.v1beta1.PeriodicAllowance':
      return ['All Transactions'];
    case '/cosmos.feegrant.v1beta1.AllowedMsgAllowance':
      return parseMsgNames(allowance.allowance.allowed_messages);
    default:
      return ['Unknown'];
  }
}

function parseMsgNames(allowedMsgs: string[]): string[] {
  const msgNames: string[] = [];
  allowedMsgs.forEach((msg) => {
    msgNames.push(getTypeURLName(msg));
  });
  return msgNames;
}
