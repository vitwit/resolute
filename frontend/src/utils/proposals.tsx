import React from "react";
import Chip from "@mui/material/Chip";

type ProposalStatusType =
  | "PROPOSAL_STATUS_VOTING_PERIOD"
  | "PROPOSAL_STATUS_DEPOSIT_PERIOD"
  | "PROPOSAL_STATUS_REJECTED"
  | "PROPOSAL_STATUS_PASSED";

interface Props {
  type: ProposalStatusType;
}

const getProposalStatusComponent: React.FC<Props> = ({ type }) => {
  switch (type) {
    case "PROPOSAL_STATUS_VOTING_PERIOD":
      return (
        <Chip
          label="Voting period"
          color="primary"
          size="small"
          variant="outlined"
        />
      );
    case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
      return (
        <Chip
          label="Deposit period"
          color="secondary"
          size="small"
          variant="outlined"
        />
      );
    case "PROPOSAL_STATUS_REJECTED":
      return (
        <Chip
          label="Rejected"
          color="error"
          size="small"
          variant="outlined"
        />
      );
    case "PROPOSAL_STATUS_PASSED":
      return (
        <Chip
          label="Passed"
          color="primary"
          variant="filled"
          size="small"
        />
      );
    default:
      return (
        <Chip
          label="Unknown"
          color="error"
          size="small"
          variant="outlined"
        />
      );
  }
};

export default getProposalStatusComponent;

export function nameToVoteOption(name: string): number {
  switch (name) {
    case "yes":
      return 1;
    case "abstain":
      return 2;
    case "no":
      return 3;
    case "noWithVeto":
      return 4;
    default:
      return 0;
  }
}

export function formatVoteOption(option: string): string {
  switch (option) {
    case "VOTE_OPTION_YES":
      return "Yes";
    case "VOTE_OPTION_NO":
      return "No";
    case "VOTE_OPTION_ABSTAIN":
      return "Abstain";
    case "VOTE_OPTION_NO_WITH_VETO":
      return "NoWithVeto";
    default:
      return "";
  }
}

interface Tally {
  yes: string | null;
  no: string | null;
  abstain: string | null;
  no_with_veto: string | null;
}

interface PoolInfo {
  pool?: {
    bonded_tokens?: string | null;
  };
}

interface Result {
  yes: string;
  no: string;
  abstain: string;
  noWithVeto: string;
}

export function computeVotingPercentage(
  tally: Tally | null,
  usePoolInfo: boolean,
  poolInfo?: PoolInfo | null
): Result {
  let yes = 0;
  let no = 0;
  let abstain = 0;
  let noWithVeto = 0;

  if (tally != null && tally.yes != null) {
    yes = parseInt(tally.yes);
    no = parseInt(tally.no || "0");
    abstain = parseInt(tally.abstain || "0");
    noWithVeto = parseInt(tally.no_with_veto || "0");
  }

  let total = yes + no + abstain + noWithVeto;
  if (usePoolInfo && poolInfo?.pool?.bonded_tokens != null) {
    total = parseInt(poolInfo.pool.bonded_tokens);
  }

  const result: Result = {
    yes: ((yes / total) * 100).toFixed(2),
    no: ((no / total) * 100).toFixed(2),
    abstain: ((abstain / total) * 100).toFixed(2),
    noWithVeto: ((noWithVeto / total) * 100).toFixed(2),
  };

  return result;
}
