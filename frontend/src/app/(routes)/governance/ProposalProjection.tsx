import { useAppSelector } from '@/custom-hooks/StateHooks';
import { TxStatus } from '@/types/enums';
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
  chainID: string;
}

const REJECTED = 'Will Be Rejected';
const PASSED = 'Will Pass';

const ProposalProjection = ({
  quorumReached,
  totalVotes,
  tallyResult,
  quorumRequired,
  quorumPercent,
  chainID,
}: ProposalProjectionProps) => {
  const getVotesProportion = (votesCount: number, totalVotes: number) => {
    return (
      (votesCount && totalVotes && (votesCount / totalVotes).toFixed(2)) || 0
    );
  };
  const yes = Number(get(tallyResult, 'yes', get(tallyResult, 'yes_count')));
  const no = Number(get(tallyResult, 'no', get(tallyResult, 'no_count')));
  const abstian = Number(
    get(tallyResult, 'abstain', get(tallyResult, 'abstain_count'))
  );
  const no_with_veto = Number(
    get(tallyResult, 'no_with_veto', get(tallyResult, 'no_with_veto_count'))
  );
  const abstain_proportion = Number(getVotesProportion(abstian, totalVotes));
  const veto_proportion = Number(getVotesProportion(no_with_veto, totalVotes));
  const yes_proportion_without_abstain = Number(
    getVotesProportion(yes, sum([yes, no, no_with_veto]))
  );

  const tallyParamsStatus = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.tallyParams?.status
  );
  const proposalTallyStatus = useAppSelector(
    (state) => state.gov.chains?.[chainID]?.tally.status
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
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#FFFFFF05] min-w-[380px]">
      <div className="flex flex-col gap-2">
        <p className="text-h2">Proposal Projection</p>
        <div className="divider-line"></div>
      </div>
      {proposalTallyStatus === TxStatus.PENDING ||
      tallyParamsStatus === TxStatus.PENDING ? (
        <>
          <div className="w-full bg-[#252525] animate-pulse h-[30px] rounded"></div>
          <div className="flex items-center gap-4 w-full">
            <div className="bg-[#252525] animate-pulse h-[30px] flex-1 rounded"></div>
            <div className="bg-[#252525] animate-pulse h-[30px] flex-1 rounded"></div>
          </div>
        </>
      ) : (
        <>
          <div className="flex space-x-2 justify-center">
            <div>
              {status === PASSED ? (
                <div className="text-[#71DD9E] text-[18px] font-bold text-center">
                  {PASSED}
                </div>
              ) : null}
              {status === REJECTED ? (
                <div className="text-[#E57575] flex flex-col justify-center items-center gap-4">
                  <div className="text-[18px] font-bold">{status}</div>
                  <div className="text-[14px] leading-[21px]">
                    <li>{reason}</li>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex gap-4 w-full">
            <div className="flex justify-center items-center gap-2 px-4 py-2 rounded-[100px] bg-[#FFFFFF05] w-[158px]">
              <p className="text-[14px] font-bold leading-[21px]">
                {Number(quorumPercent) > 0 ? (
                  <span className="">{quorumPercent}</span>
                ) : null}{' '}
                %
              </p>
              <p className="text-[rgba(255,255,255,0.50)] text-[12px] font-extralight leading-[18px]">
                Turnout
              </p>
            </div>
            <div className="flex justify-center items-center gap-2 px-4 py-2 rounded-[100px] bg-[#FFFFFF05] w-[158px]">
              <p className="text-[14px] font-bold leading-[21px]">
                {Number(quorumRequired) > 0 ? (
                  <span className="">{quorumRequired}</span>
                ) : null}{' '}
                %
              </p>
              <p className="text-[rgba(255,255,255,0.50)] text-[12px] font-extralight leading-[18px]">
                Quorum
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProposalProjection;
