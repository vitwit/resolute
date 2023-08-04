import { MsgRevokeAllowance } from "cosmjs-types/cosmos/feegrant/v1beta1/tx";
import { Msg } from "../types";

const revokeTypeUrl = "/cosmos.feegrant.v1beta1.MsgRevokeAllowance";

export function FeegrantRevokeMsg(granter: string, grantee: string): Msg {
  return {
    typeUrl: revokeTypeUrl,
    value: MsgRevokeAllowance.fromPartial({
      grantee: grantee,
      granter: granter,
    }),
  };
}

export function AuthzFeegrantRevokeMsg(granter: string, grantee: string): Msg {
  return {
    typeUrl: revokeTypeUrl,
    value: MsgRevokeAllowance.encode({
      grantee: grantee,
      granter: granter,
    }).finish(),
  };
}
