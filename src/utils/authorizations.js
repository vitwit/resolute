export function authzMsgTypes() {
    return [
        {
            label: 'Send',
            typeURL: '/cosmos.bank.v1beta1.MsgSend'
        },
        {
            label: 'Authz-Grant',
            typeURL: '/cosmos.authz.v1beta1.MsgGrant'
        },
        {
            label: 'Authz-Revoke',
            typeURL: '/cosmos.authz.v1beta1.MsgRevoke'
        },
        {
            label: 'Feegrant-Grant',
            typeURL: '/cosmos.feegrant.v1beta1.MsgGrant'
        },
        {
            label: 'Feegrant-Revoke',
            typeURL: '/cosmos.feegrant.v1beta1.MsgRevoke'
        },
        {
            label: 'Submit Proposal',
            typeURL: '/cosmos.gov.v1beta1.MsgSubmitProposal'
        },
        {
            label: 'Vote',
            typeURL: '/cosmos.gov.v1beta1.MsgVote'
        },
        {
            label: 'Withdraw Rewards',
            typeURL: '/cosmos.gov.v1beta1.MsgWithdrawRewards'
        },
        {
            label: 'Withdraw All Rewards',
            typeURL: '/cosmos.gov.v1beta1.MsgWithdrawAllRewards'
        },
        {
            label: 'ReDelegate',
            typeURL: '/cosmos.staking.v1beta1.MsgReDelegate'
        },
        {
            label: 'UnDelegate',
            typeURL: '/cosmos.staking.v1beta1.MsgUnDelegate'
        },
        {
            label: 'Withdraw Commission',
            typeURL: '/cosmos.staking.v1beta1.MsgWithdrawCommission'
        },
    ]
}


export function getTypeURLFromAuthorization(authorization) {
    switch (authorization["@type"]) {
        case "/cosmos.bank.v1beta1.SendAuthorization":
            return "/cosmos.bank.v1beta1.MsgSend"
        case "/cosmos.authz.v1beta1.GenericAuthorization":
            return authorization.msg
        default:
            throw new Error("unsupported authorization")
    }
}

export function filterVotesFromAuthz(grants) {
    if (!grants) {
        return []
    }
    let proposals = [];
    for (let i = 0; i < grants.length; i++) {
        if (grants[i]?.authorization?.msg === "/cosmos.gov.v1beta1.MsgVote") {
            proposals.push(grants[i])
        }
    }

    return proposals;
}


export function filterSendFromAuthz(grants) {
    if (!grants) {
        return []
    }
    let sends = [];
    for (let i = 0; i < grants.length; i++) {
        if (grants[i]?.authorization?.msg === "/cosmos.bank.v1beta1.MsgSend" || grants[i]?.authorization["@type"] === "/cosmos.bank.v1beta1.SendAuthorization") {
            sends.push(grants[i])
        }
    }

    return sends;
}
