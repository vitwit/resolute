import { MsgCreateGroup, MsgCreateGroupWithPolicy } from "./group/v1/tx";

// group
const msgCreateGroup = "/cosmos.group.v1.MsgCreateGroup";
const msgCreateGroupWithPolicy = "/cosmos.group.v1.MsgCreateGroupWithPolicy";

export function CreateGroup(admin, metadata, members) {
  return {
    typeUrl: msgCreateGroup,
    value: MsgCreateGroup.fromPartial({
      admin: admin,
      members: members,
      metadata: metadata,
    }),
  };
}

export function CreateGroupWithPolicy(
  admin,
  groupMetadata,
  members,
  decisionPolicy,
  policyMetadata,
  policyAsAdmin
) {
  return {
    typeUrl: msgCreateGroupWithPolicy,
    value: MsgCreateGroupWithPolicy.fromPartial({
      admin: admin,
      members: members,
      decisionPolicy: decisionPolicy,
      groupMetadata: groupMetadata,
      groupPolicyAsAdmin: policyAsAdmin,
      groupPolicyMetadata: policyMetadata,
    }),
  };
}
