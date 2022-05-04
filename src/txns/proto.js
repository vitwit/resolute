import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { SendAuthorization } from "cosmjs-types/cosmos/bank/v1beta1/authz";
import { MsgGrant, MsgRevoke } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { MsgGrantAllowance } from "cosmjs-types/cosmos/feegrant/v1beta1/tx";
import { BasicAllowance } from "cosmjs-types/cosmos/feegrant/v1beta1/feegrant";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz";

const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend";
const msgAuthzGrantTypeUrl = "/cosmos.authz.v1beta1.MsgGrant";
const msgAuthzRevokeTypeUrl = "/cosmos.authz.v1beta1.MsgRevoke";
const msgFeegrantGrantTypeUrl = "/cosmos.feegrant.v1beta1.MsgGrantAllowance";

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
    const sendAuthValue = SendAuthorization.fromPartial({
        spendLimit: [
            Coin.fromPartial({
                amount: String(spendLimit),
                denom: denom
            })
        ]
    })
    const grantValue = MsgGrant.fromPartial({
        grant: {
            authorization: {
                typeUrl: "/cosmos.bank.v1beta1.SendAuthorization",
                value: sendAuthValue,
            },
            expiration: expiration,
        },
        grantee: grantee,
        granter: granter,
    })

    return {
        typeUrl: msgAuthzGrantTypeUrl,
        value: grantValue,
    }
}


export function FeegrantBasicMsg(granter, grantee, expiration) {
    return {
        typeUrl: msgFeegrantGrantTypeUrl,
        value: MsgGrantAllowance.fromPartial({
            allowance: {
                typeUrl: "/cosmos.feegrant.v1beta1.BasicAllowance",
                value: BasicAllowance.fromPartial({}),

            },
            grantee: grantee,
            granter: granter,
        }),
    }
}


export function AuthzGenericGrantMsg(granter, grantee, typeURL, expiration) {
    
    return {
        typeUrl: msgAuthzGrantTypeUrl,
        value: MsgGrant.fromPartial({
            grant: {
                authorization: {
                    typeUrl: '/cosmos.authz.v1beta1.GenericAuthorization',
                    value: GenericAuthorization.fromPartial({
                        msg: typeURL
                    }),
                },
            },
            grantee: grantee,
            granter: granter,
        }),
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