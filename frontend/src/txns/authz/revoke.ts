import { MsgRevoke } from 'cosmjs-types/cosmos/authz/v1beta1/tx';

const msgAuthzRevokeTypeUrl = '/cosmos.authz.v1beta1.MsgRevoke';

export function AuthzRevokeMsg(
  granter: string,
  grantee: string,
  typeURL: string
): Msg {
  return {
    typeUrl: msgAuthzRevokeTypeUrl,
    value: MsgRevoke.fromPartial({
      msgTypeUrl: typeURL,
      grantee: grantee,
      granter: granter,
    }),
  };
}
