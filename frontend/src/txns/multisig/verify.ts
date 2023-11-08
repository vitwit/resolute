import { Msg } from "../types";

const msgSign = "sign/MsgSignData";

export function SignMsg(address: string): Msg {
  return {
    typeUrl: msgSign,
    value: {
      signer: address,
      data: "Resolute - Offchain Verificaiton-10",
    },
  };
}
