import { MsgClaim } from "../../txns/passage/msg_claim";
import { AminoMsg } from "@cosmjs/amino";

export interface AminoClaimAirdrop extends AminoMsg {
  type: "claim/Claim";
  value: {
    sender: string;
    claim_action: string;
  };
}

export const AirdropAminoConverter = {
  "/passage3d.claim.v1beta1.MsgClaim": {
    aminoType: "claim/Claim",
    toAmino: ({
      sender,
      claim_action,
    }: MsgClaim): AminoClaimAirdrop["value"] => {
      return {
        sender,
        claim_action,
      };
    },
    fromAmino: ({
      sender,
      claim_action,
    }: AminoClaimAirdrop["value"]): MsgClaim => {
      return {
        sender,
        claim_action,
      };
    },
  },
};
