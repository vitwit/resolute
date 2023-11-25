import { TxStatus } from './enums';

interface GovProposal {
  proposal_id: string;
  content: {
    '@type': string;
    title: string;
    description: string;
    changes?: {
      subspace: string;
      key: string;
      value: string;
    }[];
  };
  status: string;
  final_tally_result: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
  submit_time: string;
  deposit_end_time: string;
  total_deposit: {
    denom: string;
    amount: string;
  }[];
  voting_start_time: string;
  voting_end_time: string;
}

interface GovPagination {
  next_key?: string;
  total: string;
}

interface GetProposalsInVotingResponse {
  proposals: ActiveProposal[];
  pagination: GovPagination;
}

interface VoteOption {
  option: string;
  weight: string;
}

interface Vote {
  proposal_id: number;
  voter: string;
  option: string;
  options: VoteOption[];
}

interface ProposalVote {
  vote: Vote;
}

interface VotesData {
  status: TxStatus;
  errMsg: string;
  proposals: {
    [key: string]: ProposalVote;
  };
}

interface ProposalTally {
  [key: string]: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
    proposal_id: string;
  };
}

interface GetProposalTallyResponse {
  [key: string]: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
}

interface ProposalTallyData {
  status: TxStatus;
  errMsg: string;
  proposalTally: ProposalTally;
}

interface DepositParams {
  min_deposit: {
    denom: string;
    amount: string;
  }[];
  max_deposit_period: string;
}

interface TallyParams {
  quorum: string;
  threshold: string;
  vote_threshold: string;
}

interface VotingParams {
  voting_period: string;
}

interface GovParamsResponse {
  voting_params: VotingParams;
  deposit_params: DepositParams;
  tally_params: TallyParams;
}

interface GetProposalsInVotingInputs {
  baseURL: string;
  chainID: string;
  voter: string;
  key?: string;
  limit?: number;
}

interface GetProposalsInDepositInputs {
  baseURL: string;
  chainID: string;
  key?: string;
  limit?: number;
}

interface GetVotesInputs {
  baseURL: string;
  proposalId: number;
  voter: string;
  chainID: string;
  key?: string;
  limit?: number;
}

interface GetProposalTallyInputs {
  baseURL: string;
  proposalId: number;
  chainID: string;
}

interface GetDepositParamsInputs {
  baseURL: string;
  chainID: string;
}