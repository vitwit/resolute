import { convertToSnakeCase } from './util';
import { getTypeURLName } from './util';

interface FeegrantMenuItem {
  txn: string;
  typeURL: string;
}

export const BASIC_ALLOWANCE = '/cosmos.feegrant.v1beta1.BasicAllowance';
export const PERIODIC_ALLOWANCE = '/cosmos.feegrant.v1beta1.PeriodicAllowance';
export const ALLOWED_MSG_ALLOWANCE =
  '/cosmos.feegrant.v1beta1.AllowedMsgAllowance';
  
export function feegrantMsgTypes(): FeegrantMenuItem[] {
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
    {
      txn: 'Set Withdraw Address',
      typeURL: '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress',
    },
  ];
}

export function getMsgNamesFromAllowance(allowance: Allowance): string[] {
  switch (allowance.allowance['@type']) {
    case BASIC_ALLOWANCE:
      return ['All Transactions'];
    case PERIODIC_ALLOWANCE:
      return ['All Transactions'];
    case ALLOWED_MSG_ALLOWANCE:
      return parseMsgNames(allowance.allowance.allowed_messages);
    default:
      console.error(`Unknown allowance type: ${allowance?.allowance['@type']}`);
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
  set_withdraw_address: '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress',
};

export const getFeegrantFormDefaultValues = () => {
  const date = new Date();
  const MILLISECONDS_IN_A_YEAR = 365 * 86400000;
  const expiration = new Date(
    date.setTime(date.getTime() + MILLISECONDS_IN_A_YEAR)
  );

  return {
    grantee_address: '',
    expiration: expiration,
    spend_limit: '',
    period: '',
    period_spend_limit: '',
  };
};

export const getMsgListFromMsgNames = (msgNames: string[]) => {
  const msgsList: string[] = [];
  msgNames.forEach((msg) => {
    msgsList.push(MAP_TXN_MSG_TYPES[convertToSnakeCase(msg)]);
  });
  return msgsList;
};
