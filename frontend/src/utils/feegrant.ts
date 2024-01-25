import { convertToSnakeCase } from './util';

interface FeegrantMenuItem {
  txn: string;
  typeURL: string;
}

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

export const getFeegrantFormDefaultValues = () => {
  const date = new Date();
  const expiration = new Date(date.setTime(date.getTime() + 365 * 86400000));

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
  console.log(msgNames);
  msgNames.forEach((msg) => {
    msgsList.push(MAP_TXN_MSG_TYPES[convertToSnakeCase(msg)]);
  });
  return msgsList;
};
