import {
  MsgCreateGroup,
  MsgCreateGroupWithPolicy,
  MsgVote,
  MsgSubmitProposal,
  MsgExec,
  MsgUpdateGroupMembers,
  MsgLeaveGroup,
  MsgUpdateGroupPolicyDecisionPolicy,
  MsgUpdateGroupAdmin,
  MsgUpdateGroupMetadata,
  MsgCreateGroupPolicy,
  MsgUpdateGroupPolicyMetadata,
  MsgUpdateGroupPolicyAdmin,
} from "cosmjs-types/cosmos/group/v1/tx";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { MsgDelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { Duration } from "cosmjs-types/google/protobuf/duration";
import {
  PercentageDecisionPolicy,
  ThresholdDecisionPolicy,
  DecisionPolicyWindows,
  Member,
  MemberRequest,
} from "cosmjs-types/cosmos/group/v1/types";
import Long from "long";
import { Msg } from "../types";

// group

const msgCreateGroup = "/cosmos.group.v1.MsgCreateGroup";
const msgCreateGroupWithPolicy = "/cosmos.group.v1.MsgCreateGroupWithPolicy";
const msgCreateGroupWithThresholdPolicy = `/cosmos.group.v1.ThresholdDecisionPolicy`;
const msgCreateGroupWithPercentagePolicy = `/cosmos.group.v1.PercentageDecisionPolicy`;
const msgCreateGroupProposal = `/cosmos.group.v1.MsgSubmitProposal`;
const msgGroupProposalVote = `/cosmos.group.v1.MsgVote`;
const msgGroupProposalExecute = `/cosmos.group.v1.MsgExec`;
const msgUpdateGroupMember = `/cosmos.group.v1.MsgUpdateGroupMembers`;
const msgLeaveGroupMember = `/cosmos.group.v1.MsgLeaveGroup`;
const msgUpdateGroupPolicy = `/cosmos.group.v1.MsgUpdateGroupPolicyDecisionPolicy`;
const msgUpdateGroupAdmin = `/cosmos.group.v1.MsgUpdateGroupAdmin`;
const msgUpdateGroupMetadata = `/cosmos.group.v1.MsgUpdateGroupMetadata`;
const msgAddGroupPolicy = `/cosmos.group.v1.MsgCreateGroupPolicy`;
const msgUpatePolicyMetdata = `/cosmos.group.v1.MsgUpdateGroupPolicyMetadata`;
const msgUpatePolicyAdmin = `/cosmos.group.v1.MsgUpdateGroupPolicyAdmin`;

export interface GroupMetata {
  name: string;
  description: string;
  forumUrl: string;
}

export interface GroupPolicyMetata {
  name: string;
  description: string;
}

export function NewMsgCreateGroup(
  admin: string,
  metadata: GroupMetata,
  members: MemberRequest[]
): Msg {
  try {
    return {
      typeUrl: msgCreateGroup,
      value: MsgCreateGroup.fromPartial({
        admin: admin,
        members: members,
        metadata: JSON.stringify(metadata),
      }),
    };
  } catch (error) {
    console.log("Error while creating obj for group and members", error);
    throw error;
  }
}

export function NewMsgCreateGroupWithPolicy(
  admin: string,
  groupMetadata: GroupMetata,
  members: MemberRequest[],
  decisionPolicy: any,
  policyMetadata: GroupPolicyMetata,
  policyAsAdmin: boolean = false
): Msg {
  try {

    console.log(decisionPolicy)
    const obj = {
      typeUrl: msgCreateGroupWithPolicy,
      value: MsgCreateGroupWithPolicy.fromPartial({
        admin: admin,
        members: members,
        groupMetadata: JSON.stringify(groupMetadata),
        groupPolicyAsAdmin: policyAsAdmin,
        groupPolicyMetadata: JSON.stringify(policyMetadata),
        decisionPolicy: {
          typeUrl:
            (decisionPolicy?.percentage &&
              msgCreateGroupWithPercentagePolicy) ||
            msgCreateGroupWithThresholdPolicy,
          value:
            (decisionPolicy?.percentage &&
              PercentageDecisionPolicy.encode({
                percentage: parseFloat(decisionPolicy.percentage)
                  .toFixed(2)
                  .toString(),
                windows: DecisionPolicyWindows.fromPartial({
                  votingPeriod: Duration.fromPartial({
                    seconds: Long.fromNumber(decisionPolicy.votingPeriod),
                    nanos: Number(decisionPolicy.votingPeriod),
                  }),
                  minExecutionPeriod: Duration.fromPartial({
                    seconds: Long.fromNumber(decisionPolicy.minExecPeriod),
                    nanos: Number(decisionPolicy.minExecPeriod),
                  }),
                }),
              }).finish()) ||
            ThresholdDecisionPolicy.encode({
              threshold: decisionPolicy.threshold.toString(),
              windows: DecisionPolicyWindows.fromPartial({
                votingPeriod: Duration.fromPartial({
                  seconds: Long.fromNumber(decisionPolicy?.votingPeriod),
                  nanos: Number(decisionPolicy?.votingPeriod),
                }),
                minExecutionPeriod: Duration.fromPartial({
                  seconds: Long.fromNumber(decisionPolicy?.minExecPeriod),
                  nanos: Number(decisionPolicy?.minExecPeriod),
                }),
              }),
            }).finish(),
        },
      }),
    };

    return obj;
  } catch (error) {
    throw error;
  }
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
      option: option,
      metadata,
    }),
  };
}

export function CreateProposalExecute(proposalId: string, executor: string) {
  return {
    typeUrl: msgGroupProposalExecute,
    value: MsgExec.fromPartial({
      proposalId,
      executor,
    }),
  };
}

export function CreateGroupProposal(
  groupPolicyAddress = "",
  proposers: any = [],
  metadata = "",
  messages = []
) {
  var msgs: any = [];
  let length = messages?.length || 0;

  for (let i = 0; i < length; i++) {
    let msg = messages[i];
    let type = msg["typeUrl"];
    switch (type) {
      case "/cosmos.bank.v1beta1.MsgSend":
        msgs = [
          ...msgs,
          {
            typeUrl: type,
            value: MsgSend.encode(msg["value"]).finish(),
          },
        ];
        break;
      case "/cosmos.staking.v1beta1.MsgDelegate":
        msgs = [
          ...msgs,
          {
            typeUrl: type,
            value: MsgDelegate.encode(msg["value"]).finish(),
          },
        ];
        break;
    }
  }

  return {
    typeUrl: msgCreateGroupProposal,
    value: MsgSubmitProposal.fromPartial({
      groupPolicyAddress,
      proposers,
      metadata,
      messages: msgs,
    }),
  };
}

export function UpdateGroupMembers(admin: any, members: any, groupId: any) {
  const obj = {
    typeUrl: msgUpdateGroupMember,
    value: MsgUpdateGroupMembers.fromPartial({
      admin: admin,
      memberUpdates: members,
      groupId: groupId,
    }),
  };

  return obj;
}

export function NewMsgUpdateGroupAdmin(admin: string, groupId: number, newAdmin: string): Msg {
  const obj = {
    typeUrl: msgUpdateGroupAdmin,
    value: MsgUpdateGroupAdmin.fromPartial({
      admin,
      groupId,
      newAdmin,
    }),
  };

  return obj;
}

export function UpdateGroupMetadata(admin: any, groupId: any, metadata: any) {
  const obj = {
    typeUrl: msgUpdateGroupMetadata,
    value: MsgUpdateGroupMetadata.fromPartial({
      admin,
      groupId,
      metadata,
    }),
  };

  return obj;
}

export function CreateGroupPolicy(
  admin: string,
  groupId: string,
  policyMetadata: any
) {
  const obj = {
    typeUrl: msgAddGroupPolicy,
    value: MsgCreateGroupPolicy.fromPartial({
      metadata: JSON.stringify({
        name:policyMetadata?.name,
        description:policyMetadata?.description
      }) || "",
      admin: admin,
      groupId,
      decisionPolicy: {
        typeUrl:
          (policyMetadata?.percentage && msgCreateGroupWithPercentagePolicy) ||
          msgCreateGroupWithThresholdPolicy,
        value:
          (policyMetadata?.percentage &&
            PercentageDecisionPolicy.encode({
              percentage: parseFloat(policyMetadata?.percentage || 0)
                .toFixed(2)
                .toString(),
              windows: DecisionPolicyWindows.fromPartial({
                votingPeriod: Duration.fromPartial({
                  seconds: Long.fromNumber(policyMetadata?.votingPeriod),
                  nanos: Number(policyMetadata?.votingPeriod),
                }),
                minExecutionPeriod: Duration.fromPartial({
                  seconds: Long.fromNumber(policyMetadata?.minExecPeriod),
                  nanos: Number(policyMetadata?.minExecPeriod),
                }),
              }),
            }).finish()) ||
          ThresholdDecisionPolicy.encode({
            threshold: policyMetadata?.threshold?.toString(),
            windows: DecisionPolicyWindows.fromPartial({
              votingPeriod: Duration.fromPartial({
                seconds: Long.fromNumber(policyMetadata?.votingPeriod),
                nanos: Number(policyMetadata?.votingPeriod),
              }),
              minExecutionPeriod: Duration.fromPartial({
                seconds: Long.fromNumber(policyMetadata?.minExecPeriod),
                nanos: Number(policyMetadata?.minExecPeriod),
              }),
            }),
          }).finish(),
      },
    }),
  };

  return obj;
}

export function UpdateGroupPolicy(
  admin: any,
  groupPolicyAddress: any,
  policyMetadata: any
) {
  const obj = {
    typeUrl: msgUpdateGroupPolicy,
    value: MsgUpdateGroupPolicyDecisionPolicy.fromPartial({
      admin: admin,
      groupPolicyAddress: groupPolicyAddress,
      decisionPolicy: {
        typeUrl:
          (policyMetadata?.percentage && msgCreateGroupWithPercentagePolicy) ||
          msgCreateGroupWithThresholdPolicy,
        value:
          (policyMetadata?.percentage &&
            PercentageDecisionPolicy.encode({
              percentage: parseFloat(policyMetadata?.percentage || 0)
                .toFixed(2)
                .toString(),
              windows: DecisionPolicyWindows.fromPartial({
                votingPeriod: Duration.fromPartial({
                  seconds: Long.fromNumber(policyMetadata?.votingPeriod),
                  nanos: Number(policyMetadata?.votingPeriod),
                }),
                minExecutionPeriod: Duration.fromPartial({
                  seconds: Long.fromNumber(policyMetadata?.minExecPeriod),
                  nanos: Number(policyMetadata?.minExecPeriod),
                }),
              }),
            }).finish()) ||
          ThresholdDecisionPolicy.encode({
            threshold: policyMetadata?.threshold?.toString(),
            windows: DecisionPolicyWindows.fromPartial({
              votingPeriod: Duration.fromPartial({
                seconds: Long.fromNumber(policyMetadata?.votingPeriod),
                nanos: Number(policyMetadata?.votingPeriod),
              }),
              minExecutionPeriod: Duration.fromPartial({
                seconds: Long.fromNumber(policyMetadata?.minExecPeriod),
                nanos: Number(policyMetadata?.minExecPeriod),
              }),
            }),
          }).finish(),
      },
    }),
  };

  return obj;
}

export function NewMsgLeaveGroup(address: string, groupId: number): Msg {
  const obj = {
    typeUrl: msgLeaveGroupMember,
    value: MsgLeaveGroup.fromPartial({
      groupId: groupId,
      address: address,
    }),
  };

  return obj;
}

export function UpdatePolicyMetadata(admin: any, address: any, metadata: any) {
  const obj = {
    typeUrl: msgUpatePolicyMetdata,
    value: MsgUpdateGroupPolicyMetadata.fromPartial({
      admin: admin,
      groupPolicyAddress: address,
      metadata: metadata,
    }),
  };

  return obj;
}

export function UpdatePolicyAdmin(admin: any, address: any, newAdmin: any) {
  const obj = {
    typeUrl: msgUpatePolicyAdmin,
    value: MsgUpdateGroupPolicyAdmin.fromPartial({
      admin: admin,
      groupPolicyAddress: address,
      newAdmin: newAdmin,
    }),
  };

  return obj;
}
