import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { SendAuthorization } from "cosmjs-types/cosmos/bank/v1beta1/authz";
import { MsgGrant, MsgRevoke } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { MsgGrantAllowance, MsgRevokeAllowance } from "cosmjs-types/cosmos/feegrant/v1beta1/tx";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { BasicAllowance, PeriodicAllowance } from "cosmjs-types/cosmos/feegrant/v1beta1/feegrant";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz";
import { Timestamp } from "cosmjs-types/google/protobuf/timestamp";
import Long from "long";

const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend";
const msgAuthzGrantTypeUrl = "/cosmos.authz.v1beta1.MsgGrant";
const msgAuthzRevokeTypeUrl = "/cosmos.authz.v1beta1.MsgRevoke";
const msgFeegrantGrantTypeUrl = "/cosmos.feegrant.v1beta1.MsgGrantAllowance";
const msgFeegrantRevokeTypeUrl = "/cosmos.feegrant.v1beta1.MsgRevokeAllowance";

// gov
const msgVote = "/cosmos.gov.v1beta1.MsgVote";

// distribution
const msgWithdrawRewards = "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";


export function SendMsg(from, to, amount, denom) {
    return {
        typeUrl: msgSendTypeUrl,
        value: MsgSend.fromPartial({
            fromAddress: from,
            toAddress: to,
            amount: [{
                denom: denom,
                amount: String(amount),
            }],
        }),
    }
}


export function AuthzSendGrantMsg(granter, grantee, denom, spendLimit, expiration) {
    let expSec = Math.floor(expiration.getTime() / 1000)
    let expNano = (expiration.getTime() % 1000) * 1000000 + (expiration.nanoseconds ?? 0)
    const exp = Timestamp.fromPartial({
        nanos: Long.fromNumber(expNano),
        seconds: Long.fromNumber(expSec)
    })

    const sendAuthValue = SendAuthorization.encode(
        SendAuthorization.fromPartial({
            spendLimit: [
                Coin.fromPartial({
                    amount: String(spendLimit),
                    denom: denom
                })
            ]
        })).finish()
    const grantValue = MsgGrant.fromPartial({
        grant: {
            authorization: {
                typeUrl: "/cosmos.bank.v1beta1.SendAuthorization",
                value: sendAuthValue,
            },
            expiration: exp,
        },
        grantee: grantee,
        granter: granter,
    })

    return {
        typeUrl: msgAuthzGrantTypeUrl,
        value: grantValue,
    }
}


export function AuthzGenericGrantMsg(granter, grantee, typeURL, expiration) {
    let expSec = Math.floor(expiration.getTime() / 1000)
    let expNano = (expiration.getTime() % 1000) * 1000000 + (expiration.nanoseconds ?? 0)
    const exp = Timestamp.fromPartial({
        nanos: Long.fromNumber(expNano),
        seconds: Long.fromNumber(expSec)
    })

    return {
        typeUrl: msgAuthzGrantTypeUrl,
        value: {
            grant: {
                authorization: {
                    typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
                    value: GenericAuthorization.encode(
                        GenericAuthorization.fromPartial({
                            msg: typeURL,
                        }),
                    ).finish(),
                },
                expiration: exp,
            },
            grantee: grantee,
            granter: granter,
        },
    }
}


export function AuthzRevokeMsg(granter, grantee, typeURL) {
    return {
        typeUrl: msgAuthzRevokeTypeUrl,
        value: MsgRevoke.fromPartial({
            msgTypeUrl: typeURL,
            grantee: grantee,
            granter: granter,
        }),
    }
}


export function GovVoteMsg(proposalId, voter, option) {
    return {
        typeUrl: msgVote,
        value: MsgVote.fromPartial({
            voter: voter,
            option: option,
            proposalId: proposalId
        }),
    }
}


export function FeegrantBasicMsg(granter, grantee, denom, spendLimit, expiration) {
    let expSec = Math.floor(expiration.getTime() / 1000)
    let expNano = (expiration.getTime() % 1000) * 1000000 + (expiration.nanoseconds ?? 0)
    const exp = Timestamp.fromPartial(
        {
            nanos: Long.fromNumber(expNano),
            seconds: Long.fromNumber(expSec)
        }
    )

    const basicValue = BasicAllowance.encode(
        BasicAllowance.fromPartial({
            spendLimit: spendLimit === null ? null : [
                Coin.fromPartial({
                    amount: String(spendLimit),
                    denom: denom
                })
            ],
            expiration: exp
        })).finish()

    return {
        typeUrl: msgFeegrantGrantTypeUrl,
        value: MsgGrantAllowance.fromPartial({
            allowance: {
                typeUrl: "/cosmos.feegrant.v1beta1.BasicAllowance",
                value: basicValue,
            },
            grantee: grantee,
            granter: granter,
        }),
    }
}

export function FeegrantPeriodicMsg(granter, grantee, denom, spendLimit, expiration) {
    let expSec = Math.floor(expiration.getTime() / 1000)
    let expNano = (expiration.getTime() % 1000) * 1000000 + (expiration.nanoseconds ?? 0)
    const exp = Timestamp.encode({
        nanos: Long.fromNumber(expNano),
        seconds: Long.fromNumber(expSec)
    }).finish()

    const basicValue = BasicAllowance.encode(
        BasicAllowance.fromPartial({
            expiration: exp,
            spendLimit: [
                Coin.fromPartial({
                    amount: String(spendLimit),
                    denom: denom
                })
            ]
        })).finish()

    const periodicValue = PeriodicAllowance.encode(
        PeriodicAllowance.fromPartial({
            basic: basicValue,
        })).finish()

    return {
        typeUrl: msgFeegrantGrantTypeUrl,
        value: PeriodicAllowance.fromPartial({
            allowance: {
                typeUrl: "/cosmos.feegrant.v1beta1.PeriodicAllowance",
                value: periodicValue,

            },
            grantee: grantee,
            granter: granter,
        }),
    }
}

export function FeegrantRevokeMsg(granter, grantee) {
    return {
        typeUrl: msgFeegrantRevokeTypeUrl,
        value: MsgRevokeAllowance.fromPartial({
            grantee: grantee,
            granter: granter,
        }),
    }
}

export function WithdrawAllRewardsMsg(delegator, validator) {
    return {
        typeUrl: msgWithdrawRewards,
        value: MsgWithdrawDelegatorReward.fromPartial({
            delegatorAddress: delegator,
            validatorAddress: validator,
        }),
    }
}