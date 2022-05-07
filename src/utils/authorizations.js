export function authzMsgTypes() {
    return [
        {
            label: 'Send',
            typeURL : '/cosmos.bank.v1beta1.MsgSend'
        },
        {
            label: 'Authz-Grant',
            typeURL : '/cosmos.authz.v1beta1.MsgGrant'
        },
        {
            label: 'Authz-Revoke',
            typeURL : '/cosmos.authz.v1beta1.MsgRevoke'
        },
        {
            label: 'Feegrant-Grant',
            typeURL : '/cosmos.feegrant.v1beta1.MsgGrant'
        },
        {
            label: 'Feegrant-Revoke',
            typeURL : '/cosmos.feegrant.v1beta1.MsgRevoke'
        },
        {
            label: 'Submit Proposal',
            typeURL : '/cosmos.gov.v1beta1.MsgSubmitProposal'
        },
        {
            label: 'Vote',
            typeURL : '/cosmos.gov.v1beta1.MsgVote'
        },
        {
            label: 'Withdraw Rewards',
            typeURL : '/cosmos.gov.v1beta1.MsgWithdrawRewards'
        },
        {
            label: 'Withdraw All Rewards',
            typeURL : '/cosmos.gov.v1beta1.MsgWithdrawAllRewards'
        },
        {
            label: 'ReDelegate',
            typeURL : '/cosmos.staking.v1beta1.MsgReDelegate'
        },
        {
            label: 'UnDelegate',
            typeURL : '/cosmos.staking.v1beta1.MsgUnDelegate'
        },
        {
            label: 'Withdraw Commission',
            typeURL : '/cosmos.staking.v1beta1.MsgWithdrawCommission'
        },
    ]
}
