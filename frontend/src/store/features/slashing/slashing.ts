import { MsgUnjail } from "../../txns/slashing/tx";
import { AminoMsg } from "@cosmjs/amino";
import { AminoConverters } from "@cosmjs/stargate";

export interface AminoMsgUnjail extends AminoMsg {
  readonly type: "cosmos-sdk/MsgUnjail";
  readonly value: {
    readonly address: string;
  };
}

export function isAminoMsgUnjail(msg: AminoMsg): msg is AminoMsgUnjail {
  return msg.type === "cosmos-sdk/MsgUnjail";
}


export const slashingAminoConverter = (): AminoConverters => {
  return {
  "/cosmos.slashing.v1beta1.MsgUnjail": {
    aminoType: "cosmos-sdk/MsgUnjail",
    toAmino: ({ validatorAddr }: MsgUnjail): AminoMsgUnjail["value"] => {
      return {
        address: validatorAddr,
      };
    },
    fromAmino: ({ address }: AminoMsgUnjail["value"]): MsgUnjail => {
      return {
        validatorAddr: address,
      };
    },
  }
}
};
