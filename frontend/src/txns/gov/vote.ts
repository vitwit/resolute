import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import { MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx';

export const msgVoteTypeUrl = '/cosmos.gov.v1beta1.MsgVote';

export function GovVoteMsg(
  proposalId: number,
  voter: string,
  option: VoteOption
): Msg {
  return {
    typeUrl: msgVoteTypeUrl,
    value: MsgVote.fromPartial({
      voter: voter,
      option: option,
      proposalId: BigInt(proposalId),
    }),
  };
}

const voteOptions: Record<string, string> = {
  VOTE_OPTION_YES: 'Yes',
  VOTE_OPTION_ABSTAIN: 'Abstain',
  VOTE_OPTION_NO: 'No',
  VOTE_OPTION_NO_WITH_VETO: 'NoWithVeto',
  VOTE_OPTION_UNSPECIFIED: '',
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function serializeMsgVote(msg: any) {
  const { option, proposal_id } = msg;
  return `Voted ${voteOptions?.[option] || '-'} on proposal #${proposal_id}`;
}
