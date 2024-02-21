import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import {  } from 'cosmjs-types/cosmos/gov/v1beta1/tx';

const msgVote = '/cosmos.gov.v1beta1.MsgVote';

export function GovVoteMsg(
  proposalId: number,
  voter: string,
  option: VoteOption
): Msg {
  return {
    typeUrl: msgVote,
    value: MsgVote.fromPartial({
      voter: voter,
      option: option,
      proposalId: BigInt(proposalId),
    }),
  };
}
