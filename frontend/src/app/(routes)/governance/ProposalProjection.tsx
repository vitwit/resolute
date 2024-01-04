import { get, sum } from 'lodash';
import React from 'react';

interface TallyResult {
  yes: string;
  abstain: string;
  no: string;
  no_with_veto: string;
  proposal_id: string;
}

interface ProposalProjectionProps {
  quorumReached: boolean;
  totalVotes: number;
  tallyResult: TallyResult;
  quorumRequired: string;
  quorumPercent: string;
}

const REJECTED = 'Will Be Rejected';
const PASSED = 'Will Pass';

const ProposalProjection = ({
  quorumReached,
  totalVotes,
  tallyResult,
  quorumRequired,
  quorumPercent,
}: ProposalProjectionProps) => {
  const getVotesProportion = (votesCount: number, totalVotes: number) => {
    return (
      (votesCount && totalVotes && (votesCount / totalVotes).toFixed(2)) || 0
    );
  };
  const yes = Number(get(tallyResult, 'yes'));
  const no = Number(get(tallyResult, 'no'));
  const abstian = Number(get(tallyResult, 'abstain'));
  const no_with_veto = Number(get(tallyResult, 'no_with_veto'));
  const abstain_proportion = Number(getVotesProportion(abstian, totalVotes));
  const veto_proportion = Number(getVotesProportion(no_with_veto, totalVotes));
  const yes_proportion_without_abstain = Number(
    getVotesProportion(yes, sum([yes, no, no_with_veto]))
  );

  const getProposalStatus = (): { status: string; reason: string } => {
    let reason = '-';
    let status = '-';
    if (quorumReached) {
      if (abstain_proportion < 1) {
        if (veto_proportion < 1 / 3) {
          if (yes_proportion_without_abstain > 1 / 2) {
            status = PASSED;
          } else {
            reason = `Threshold not reached (${(
              yes_proportion_without_abstain * 100
            ).toFixed(1)}/50.0%)`;
            status = REJECTED;
          }
        } else {
          reason = `Veto threshold reached (${(veto_proportion * 100).toFixed(
            1
          )}/33.4%)`;
          status = REJECTED;
        }
      } else {
        reason = 'Proportion of Abstain votes is 100%';
        status = REJECTED;
      }
    } else {
      reason = `Quorum not reached ${quorumPercent}% / ${quorumRequired}%`;
      status = REJECTED;
    }
    return { status, reason };
  };

  const { reason, status } = getProposalStatus();

  return (
    <div>
      {status === PASSED ? (
        <div className="text-[#71DD9E] text-[20px] font-bold">{PASSED}</div>
      ) : null}
      {status === REJECTED ? (
        <div className="text-[#E57575] flex flex-col justify-center items-center gap-4">
          <div className="text-[20px] font-bold">{status}</div>
          <div>
            <li>{reason}</li>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProposalProjection;
