interface AuthzMenuItem {
  txn: string;
  typeURL: string;
}

export function authzMsgTypes(): AuthzMenuItem[] {
  return [
    {
      txn: 'Send',
      typeURL: '/cosmos.bank.v1beta1.MsgSend',
    },
    {
      txn: 'Grant Authz',
      typeURL: '/cosmos.authz.v1beta1.MsgGrant',
    },
    {
      txn: 'Revoke Authz',
      typeURL: '/cosmos.authz.v1beta1.MsgRevoke',
    },
    {
      txn: 'Grant Feegrant',
      typeURL: '/cosmos.feegrant.v1beta1.MsgGrantAllowance',
    },
    {
      txn: 'Revoke Feegrant',
      typeURL: '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
    },
    {
      txn: 'Submit Proposal',
      typeURL: '/cosmos.gov.v1beta1.MsgSubmitProposal',
    },
    {
      txn: 'Vote',
      typeURL: '/cosmos.gov.v1beta1.MsgVote',
    },
    {
      txn: 'Deposit',
      typeURL: '/cosmos.gov.v1beta1.MsgDeposit',
    },
    {
      txn: 'Withdraw Rewards',
      typeURL: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    },
    {
      txn: 'Redelegate',
      typeURL: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
    },
    {
      txn: 'Delegate',
      typeURL: '/cosmos.staking.v1beta1.MsgDelegate',
    },
    {
      txn: 'Undelegate',
      typeURL: '/cosmos.staking.v1beta1.MsgUndelegate',
    },
    {
      txn: 'Withdraw Commission',
      typeURL: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
    },
    {
      txn: 'Unjail',
      typeURL: '/cosmos.slashing.v1beta1.MsgUnjail',
    },
  ];
}

export const MAP_TXN_MSG_TYPES: Record<string, string> = {
  send: '/cosmos.bank.v1beta1.MsgSend',
  grant_authz: '/cosmos.authz.v1beta1.MsgGrant',
  revoke_authz: '/cosmos.authz.v1beta1.MsgRevoke',
  grant_feegrant: '/cosmos.feegrant.v1beta1.MsgGrantAllowance',
  revoke_feegrant: '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
  submit_proposal: '/cosmos.gov.v1beta1.MsgSubmitProposal',
  vote: '/cosmos.gov.v1beta1.MsgVote',
  deposit: '/cosmos.gov.v1beta1.MsgDeposit',
  withdraw_rewards: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
  redelegate: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
  delegate: '/cosmos.staking.v1beta1.MsgDelegate',
  undelegate: '/cosmos.staking.v1beta1.MsgUndelegate',
  withdraw_commission:
    '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
  unjail: '/cosmos.slashing.v1beta1.MsgUnjail',
};

export const grantAuthzFormDefaultValues = () => {
  const date = new Date();
  const expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));
  return {
    grant_authz: { expiration: expiration },
    revoke_authz: { expiration: expiration },
    grant_feegrant: { expiration: expiration },
    revoke_feegrant: { expiration: expiration },
    submit_proposal: { expiration: expiration },
    vote: { expiration: expiration },
    deposit: { expiration: expiration },
    withdraw_rewards: { expiration: expiration },
    withdraw_commission: { expiration: expiration },
    unjail: { expiration: expiration },
    send: { expiration: expiration, spend_limit: '' },
    delegate: { expiration: expiration, max_tokens: '' },
    undelegate: { expiration: expiration, max_tokens: '' },
    redelegate: { expiration: expiration, max_tokens: '' },
  };
};
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

export function getTypeURLFromAuthorization(
  authorization: Authorization
): string {
  switch (authorization.authorization['@type']) {
    case '/cosmos.bank.v1beta1.SendAuthorization':
      return '/cosmos.bank.v1beta1.MsgSend';
    case '/cosmos.authz.v1beta1.GenericAuthorization':
      return authorization.authorization.msg;
    case '/cosmos.staking.v1beta1.StakeAuthorization':
      return getStakeAuthzType(authorization?.authorization.authorization_type);
    default:
      throw new Error('unsupported authorization');
  }
}

export const getAllTypeURLsFromAuthorization = (
  authorizations: Authorization[]
): string[] => {
  const typeURLs: string[] = [];
  authorizations.forEach((authorization) => {
    typeURLs.push(getTypeURLFromAuthorization(authorization));
  });
  return typeURLs;
};

export const GENRIC_GRANTS = [
  'grant_authz',
  'revoke_authz',
  'grant_feegrant',
  'revoke_feegrant',
  'submit_proposal',
  'vote',
  'deposit',
  'withdraw_rewards',
  'withdraw_commission',
  'unjail',
];
export const STAKE_GRANTS = ['delegate', 'undelegate', 'redelegate'];
