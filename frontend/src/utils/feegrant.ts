import { getTypeURLName } from './util';

const BASIC_ALLOWANCE = '/cosmos.feegrant.v1beta1.BasicAllowance';
const PERIODIC_ALLOWANCE = '/cosmos.feegrant.v1beta1.PeriodicAllowance';
const ALLOWED_MSG_ALLOWANCE = '/cosmos.feegrant.v1beta1.AllowedMsgAllowance';

export function getMsgNamesFromAllowance(allowance: Allowance): string[] {
  switch (allowance.allowance['@type']) {
    case BASIC_ALLOWANCE:
      return ['All Transactions'];
    case PERIODIC_ALLOWANCE:
      return ['All Transactions'];
    case ALLOWED_MSG_ALLOWANCE:
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

export const isFeegrantAvailable = (
  allowance: Allowance,
  txnMsg: string
): boolean => {
  switch (allowance.allowance['@type']) {
    case BASIC_ALLOWANCE:
      return true;
    case PERIODIC_ALLOWANCE:
      return true;
    case ALLOWED_MSG_ALLOWANCE:
      return allowance.allowance.allowed_messages.includes(txnMsg);
    default:
      return false;
  }
};

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
  cancel_unbonding: '/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation',
};
