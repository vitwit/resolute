import { MsgDeposit } from 'cosmjs-types/cosmos/gov/v1beta1/tx';

const msgDeposit = '/cosmos.gov.v1beta1.MsgDeposit';

export function GovDepositMsg(
  proposalId: number,
  depositer: string,
  amount: number,
  denom: string
): Msg {
  return {
    typeUrl: msgDeposit,
    value: MsgDeposit.fromPartial({
      depositor: depositer,
      proposalId: BigInt(proposalId),
      amount: [
        {
          denom: denom,
          amount: String(amount),
        },
      ],
    }),
  };
}
