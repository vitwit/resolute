import { MsgExec } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import {
  MsgBeginRedelegate,
  MsgDelegate,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import Long from "long";
import { MsgUnjail } from "../slashing/tx";
import { Msg } from "../types";

const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend";
const msgAuthzExecypeUrl = "/cosmos.authz.v1beta1.MsgExec";
const msgVote = "/cosmos.gov.v1beta1.MsgVote";
const msgWithdrawRewards =
  "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";
const msgDelegate = "/cosmos.staking.v1beta1.MsgDelegate";
const msgUnDelegate = "/cosmos.staking.v1beta1.MsgUndelegate";
const msgReDelegate = "/cosmos.staking.v1beta1.MsgBeginRedelegate";

const msgUnjail = "/cosmos.slashing.v1beta1.MsgUnjail";

export function AuthzExecSendMsg(
  grantee: string,
  from: string,
  to: string,
  amount: number,
  denom: string
): Msg {
  return {
    typeUrl: msgAuthzExecypeUrl,
    value: MsgExec.fromPartial({
      grantee: grantee,
      msgs: [
        {
          typeUrl: msgSendTypeUrl,
          value: MsgSend.encode({
            fromAddress: from,
            toAddress: to,
            amount: [
              {
                denom: denom,
                amount: String(amount),
              },
            ],
          }).finish(),
        },
      ],
    }),
  };
}

export function AuthzExecVoteMsg(
  grantee: string,
  proposalId: number,
  option: VoteOption,
  granter: string
): Msg {
  return {
    typeUrl: msgAuthzExecypeUrl,
    value: MsgExec.fromPartial({
      grantee: grantee,
      msgs: [
        {
          typeUrl: msgVote,
          value: MsgVote.encode({
            option: option,
            proposalId: new Long(proposalId),
            voter: granter,
          }).finish(),
        },
      ],
    }),
  };
}

export function AuthzExecWithdrawRewardsMsg(
  grantee: string,
  payload: any[]
): Msg {
  let msgs = [];
  for (let i = 0; i < payload.length; i++) {
    msgs.push({
      typeUrl: msgWithdrawRewards,
      value: MsgWithdrawDelegatorReward.encode({
        delegatorAddress: payload[i].delegator,
        validatorAddress: payload[i].validator,
      }).finish(),
    });
  }
  return {
    typeUrl: msgAuthzExecypeUrl,
    value: MsgExec.fromPartial({
      grantee: grantee,
      msgs: msgs,
    }),
  };
}

export function AuthzExecDelegateMsg(
  grantee: string,
  granter: string,
  validator: string,
  amount: number,
  denom: string
): Msg {
  return {
    typeUrl: msgAuthzExecypeUrl,
    value: MsgExec.fromPartial({
      grantee: grantee,
      msgs: [
        {
          typeUrl: msgDelegate,
          value: MsgDelegate.encode({
            delegatorAddress: granter,
            validatorAddress: validator,
            amount: Coin.fromPartial({
              amount: String(amount),
              denom: denom,
            }),
          }).finish(),
        },
      ],
    }),
  };
}

export function AuthzExecReDelegateMsg(
  grantee: string,
  granter: string,
  src: string,
  dest: string,
  amount: number,
  denom: string
): Msg {
  return {
    typeUrl: msgAuthzExecypeUrl,
    value: MsgExec.fromPartial({
      grantee: grantee,
      msgs: [
        {
          typeUrl: msgReDelegate,
          value: MsgBeginRedelegate.encode({
            validatorDstAddress: dest,
            delegatorAddress: granter,
            validatorSrcAddress: src,
            amount: Coin.fromPartial({
              amount: String(amount),
              denom: denom,
            }),
          }).finish(),
        },
      ],
    }),
  };
}

export function AuthzExecUnDelegateMsg(
  grantee: string,
  granter: string,
  validator: string,
  amount: number,
  denom: string
): Msg {
  return {
    typeUrl: msgAuthzExecypeUrl,
    value: MsgExec.fromPartial({
      grantee: grantee,
      msgs: [
        {
          typeUrl: msgUnDelegate,
          value: MsgUndelegate.encode({
            validatorAddress: validator,
            delegatorAddress: granter,
            amount: Coin.fromPartial({
              amount: String(amount),
              denom: denom,
            }),
          }).finish(),
        },
      ],
    }),
  };
}

export function AuthzExecMsgUnjail(validator: string, grantee: string): Msg {
  return {
    typeUrl: msgAuthzExecypeUrl,
    value: MsgExec.fromPartial({
      grantee: grantee,
      msgs: [
        {
          typeUrl: msgUnjail,
          value: MsgUnjail.encode({
            validatorAddr: validator,
          }).finish(),
        },
      ],
    }),
  };
}

export function AuthzExecMsgRevoke(feegrant: Msg, grantee: string): Msg {
  return {
    typeUrl: msgAuthzExecypeUrl,
    value: MsgExec.fromPartial({
      grantee: grantee,
      msgs: [
        feegrant,
      ],
    }),
  };
}

export function AuthzExecMsgFeegrant(feegrant: Msg, grantee: string): Msg {
  return {
    typeUrl: msgAuthzExecypeUrl,
    value: MsgExec.fromPartial({
      grantee: grantee,
      msgs: [
        feegrant,
      ],
    }),
  };
}
