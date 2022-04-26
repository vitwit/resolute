export function authzMsgTypes() {
    return [
        {
            label: 'Send',
            typeURL : '/cosmos.bank.v1beta1.Send'
        },
        {
            label: 'Authz/Grant',
            typeURL : '/cosmos.authz.v1beta1.Grant'
        },
        {
            label: 'Authz/Revoke',
            typeURL : '/cosmos.authz.v1beta1.Revoke'
        },
        {
            label: 'Feegrant/Grant',
            typeURL : '/cosmos.feegrant.v1beta1.Grant'
        },
        {
            label: 'Feegrant/Revoke',
            typeURL : '/cosmos.feegrant.v1beta1.Revoke'
        },
        {
            label: 'Submit Proposal',
            typeURL : '/cosmos.gov.v1beta1.SubmitProposal'
        },
        {
            label: 'Vote',
            typeURL : '/cosmos.gov.v1beta1.Vote'
        },
        {
            label: 'Withdraw Rewards',
            typeURL : '/cosmos.gov.v1beta1.WithdrawRewards'
        },
        {
            label: 'Withdraw All Rewards',
            typeURL : '/cosmos.gov.v1beta1.WithdrawAllRewards'
        },
        {
            label: 'Re Delegate',
            typeURL : '/cosmos.staking.v1beta1.MsgReDelegate'
        },
        {
            label: 'Un Delegate',
            typeURL : '/cosmos.staking.v1beta1.MsgUnDelegate'
        },
        {
            label: 'Withdraw Commission',
            typeURL : '/cosmos.staking.v1beta1.MsgWithdrawCommission'
        },
    ]
}
