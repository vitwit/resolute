import { Msg } from "../../types/types";
import { MsgUnjail } from "cosmjs-types/cosmos/slashing/v1beta1/tx";

export function Unjail(validator: string): Msg {
  return {
    typeUrl: "/cosmos.slashing.v1beta1.MsgUnjail",
    value: MsgUnjail.fromPartial({
      validatorAddr: validator,
    }),
  };
}
