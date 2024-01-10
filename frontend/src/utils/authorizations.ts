import { Authorization } from "@/types/authz";

export function getTypeURLName(url: string) {
  if (!url) {
    return '-';
  }
  const temp = url.split('.');
  if (temp?.length > 0) {
    const msg = temp[temp?.length - 1];
    return msg.slice(3, msg.length);
  }
  return '-';
}

function getStakeAuthzType(type: string): string {
  switch (type) {
    case 'AUTHORIZATION_TYPE_DELEGATE':
      return '/cosmos.staking.v1beta1.MsgDelegate';
    case 'AUTHORIZATION_TYPE_UNDELEGATE':
      return '/cosmos.staking.v1beta1.MsgUndelegate';
    case 'AUTHORIZATION_TYPE_REDELEGATE':
      return '/cosmos.staking.v1beta1.MsgBeginRedelegate';
    default:
      throw new Error('unsupported stake authorization type');
  }
}

export function getMsgNameFromAuthz(authorization: Authorization): string {
  switch (authorization.authorization['@type']) {
    case '/cosmos.bank.v1beta1.SendAuthorization':
      return 'Send';
    case '/cosmos.authz.v1beta1.GenericAuthorization':
      return getTypeURLName(authorization.authorization.msg);
    case '/cosmos.staking.v1beta1.StakeAuthorization':
      const temp = getStakeAuthzType(
        authorization?.authorization.authorization_type
      ).split('.');
      if (temp.length === 0) {
        return 'Unknown';
      }
      return temp[temp.length - 1];
    default:
      return 'Unknown';
  }
}
