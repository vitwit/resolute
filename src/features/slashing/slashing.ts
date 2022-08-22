import { MsgUnjail } from "../../txns/slashing/tx";
import { AminoMsg } from "@cosmjs/amino";

export interface AminoMsgUnjail extends AminoMsg {
  type: "cosmos-sdk/MsgUnjail";
  value: {
    validatorAddr: string;
  };
}

export const SlashingAminoConverter = {
  "/cosmos.slashing.v1beta1.MsgUnjail": {
    aminoType: "cosmos-sdk/MsgUnjail",
    toAmino: ({ validatorAddr }: MsgUnjail): AminoMsgUnjail["value"] => {
      return {
        validatorAddr,
      };
    },
    fromAmino: ({ validatorAddr }: AminoMsgUnjail["value"]): MsgUnjail => {
      return {
        validatorAddr,
      };
    },
  },
};
