import { MsgSetWithdrawAddress } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';

export const msgSetWithdrawAddress =
  '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress';

export function SetWithdrawAddressMsg(
  delegatorAddress: string,
  withdrawAddress: string
): Msg {
  return {
    typeUrl: msgSetWithdrawAddress,
    value: MsgSetWithdrawAddress.fromPartial({
      delegatorAddress: delegatorAddress,
      withdrawAddress: withdrawAddress,
    }),
  };
}

export function EncodedSetWithdrawAddressMsg(
  delegatorAddress: string,
  withdrawAddress: string
): Msg {
  return {
    typeUrl: msgSetWithdrawAddress,
    value: MsgSetWithdrawAddress.encode({
      delegatorAddress: delegatorAddress,
      withdrawAddress: withdrawAddress,
    }).finish(),
  };
}
