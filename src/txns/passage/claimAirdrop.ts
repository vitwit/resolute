import { Msg } from "../types";
import { MsgClaim } from "./msg_claim";

export function AirdropClaim(address: string): Msg {
  return {
    typeUrl: "/passage3d.claim.v1beta1.MsgClaim",
    value: MsgClaim.fromPartial({
      sender: address,
      claim_action: "ActionInitialClaim",
    }),
  };
}
