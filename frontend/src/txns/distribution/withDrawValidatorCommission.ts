import { MsgWithdrawValidatorCommission } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';

export const msgWithdrawValidatorCommission =
  '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission';

export function WithdrawValidatorCommissionMsg(validator: string): Msg {
  return {
    typeUrl: msgWithdrawValidatorCommission,
    value: MsgWithdrawValidatorCommission.fromPartial({
      validatorAddress: validator,
    }),
  };
}

export function EncodedWithdrawValidatorCommissionMsg(validator: string): Msg {
  return {
    typeUrl: msgWithdrawValidatorCommission,
    value: MsgWithdrawValidatorCommission.encode({
      validatorAddress: validator,
    }).finish(),
  };
}
