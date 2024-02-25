import { parseBalance } from '@/utils/denom';
import { formatNumber } from '@/utils/util';
import { MsgDeposit } from 'cosmjs-types/cosmos/gov/v1beta1/tx';

export const msgDepositTypeUrl = '/cosmos.gov.v1beta1.MsgDeposit';

export function GovDepositMsg(
  proposalId: number,
  depositer: string,
  amount: number,
  denom: string
): Msg {
  return {
    typeUrl: msgDepositTypeUrl,
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

/* eslint-disable @typescript-eslint/no-explicit-any */
export function serializeMsgDeposit(
  msg: any,
  decimals: number,
  originalDenom: string
) {
  const { proposal_id, amount } = msg;
  const parsedAmount = parseBalance(amount, decimals, amount[0].denom);
  return `Deposited ${formatNumber(parsedAmount)} ${originalDenom} on proposal #${proposal_id}`;
}
