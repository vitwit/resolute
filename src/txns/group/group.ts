import {
    MsgCreateGroup, MsgCreateGroupWithPolicy,
    MsgVote,
    MsgSubmitProposal
} from "./v1/tx";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import {
    MsgDelegate
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { Duration } from "cosmjs-types/google/protobuf/duration";
import {
    PercentageDecisionPolicy, ThresholdDecisionPolicy,
    DecisionPolicyWindows,
} from "./v1/types";
import Long from "long";

// group

const msgCreateGroup = "/cosmos.group.v1.MsgCreateGroup";
const msgCreateGroupWithPolicy = "/cosmos.group.v1.MsgCreateGroupWithPolicy";
const msgCreateGroupWithThresholdPolicy = `/cosmos.group.v1.ThresholdDecisionPolicy`;
const msgCreateGroupWithPercentagePolicy = `/cosmos.group.v1.PercentageDecisionPolicy`;
const msgCreateGroupProposal = `/cosmos.group.v1.MsgSubmitProposal`;
const msgGroupProposalVote = `/cosmos.group.v1.VotesByVoter`

export function CreateGroup(admin: any, metadata: any, members: any) {
    return {
        typeUrl: msgCreateGroup,
        value: MsgCreateGroup.fromPartial({
            admin: admin,
            members: members,
            metadata: metadata,
        }),
    };
}

export function CreateProposalVote(
    proposalId: string,
    voter: string,
    option: any,
    metadata?: string
) {
    return {
        typeUrl: msgGroupProposalVote,
        value: MsgVote.fromPartial({
            proposalId,
            voter,
            option,
            metadata
        })
    }
}

export function CreateGroupProposal(groupPolicyAddress = '',
    proposers: any = [], metadata = '', messages = []) {
    var msgs: any = [];
    let length = messages?.length || 0;

    for (let i = 0; i < length; i++) {
        let msg = messages[i];
        let type = msg['typeUrl'];
        switch (type) {
            case '/cosmos.bank.v1beta1.MsgSend':
                msgs = [...msgs, {
                    typeUrl: type,
                    value: MsgSend.encode(msg['value']).finish()
                }]
                break;
            case '/cosmos.staking.v1beta1.MsgDelegate':
                msgs = [...msgs, {
                    typeUrl: type,
                    value: MsgDelegate.encode(msg['value']).finish(),
                }]
                break;
        }
    }

    return {
        typeUrl: msgCreateGroupProposal,
        value: MsgSubmitProposal.fromPartial({
            groupPolicyAddress,
            proposers,
            metadata,
            messages: msgs
        })
    }
}

export function CreateGroupWithPolicy(
    admin: any,
    groupMetadata: any,
    members: any,
    decisionPolicy: any,
    policyMetadata: any,
    policyAsAdmin: any
) {
    console.log('policy metada--------', policyMetadata)

    const obj = {
        typeUrl: msgCreateGroupWithPolicy,
        value: MsgCreateGroupWithPolicy.fromPartial({
            admin: admin,
            members: members,
            decisionPolicy: {
                typeUrl: policyMetadata?.percentage && msgCreateGroupWithPercentagePolicy ||
                    msgCreateGroupWithThresholdPolicy,
                value: policyMetadata?.percentage &&
                    PercentageDecisionPolicy.encode({
                        percentage: parseFloat(policyMetadata?.percentage || 0).toFixed(2).toString(),
                        windows: DecisionPolicyWindows.fromPartial({
                            votingPeriod: Duration.fromPartial({
                                seconds: Long.fromNumber(policyMetadata?.votingPeriod),
                                nanos: Number(policyMetadata?.votingPeriod)
                            }),
                            minExecutionPeriod: Duration.fromPartial({
                                seconds: Long.fromNumber(policyMetadata?.minExecPeriod),
                                nanos: Number(policyMetadata?.minExecPeriod)
                            }),
                        })
                    }).finish() ||
                    ThresholdDecisionPolicy.encode({
                        threshold: policyMetadata?.threshold?.toString(),
                        windows: DecisionPolicyWindows.fromPartial({
                            votingPeriod: Duration.fromPartial({
                                seconds: Long.fromNumber(policyMetadata?.votingPeriod),
                                nanos: Number(policyMetadata?.votingPeriod)
                            }),
                            minExecutionPeriod: Duration.fromPartial({
                                seconds: Long.fromNumber(policyMetadata?.minExecPeriod),
                                nanos: Number(policyMetadata?.minExecPeriod)
                            }),
                        })
                    }).finish()
            },
            groupMetadata: groupMetadata,
            groupPolicyAsAdmin: policyAsAdmin,
            groupPolicyMetadata: policyMetadata,
        }),
    };
    return obj;
}

