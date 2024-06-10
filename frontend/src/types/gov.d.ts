import { TxStatus } from './enums';

interface GovProposal {
  proposal_id: string;
  content?: {
    '@type': string;
    title: string;
    description: string;
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

interface ProposalInfo {
  status: TxStatus;
  errMsg: string;
  proposal: GovProposal;
}

interface GetProposalsInVotingResponse {
  proposals: GovProposal[];
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
  baseURLs: string[];
  chainID: string;
  voter: string;
  govV1: boolean;
  key?: string;
  limit?: number;
}

interface GetProposalsInDepositInputs {
  baseURL: string;
  baseURLs: string[];
  chainID: string;
  key?: string;
  limit?: number;
  govV1: boolean;
}

interface GetVotesInputs {
  baseURL: string;
  baseURLs: string[];
  proposalId: number;
  voter: string;
  chainID: string;
  key?: string;
  limit?: number;
  govV1: boolean;
}

interface GetProposalTallyInputs {
  baseURL: string;
  baseURLs: string[];
  proposalId: number;
  chainID: string;
  govV1: boolean;
}

interface GetDepositParamsInputs {
  baseURL: string;
  baseURLs: string[];
  chainID: string;
}

interface GetProposalInputs {
  baseURL: string;
  baseURLs: string[];
  proposalId: number;
  chainID: string;
  govV1: boolean;
}

interface TxVoteInputs {
  isAuthzMode: false;
  basicChainInfo: BasicChainInfo;
  voter: string;
  proposalId: number;
  option: number;
  denom: string;
  chainID: string;
  rpc: string;
  rest: string;
  aminoConfig: AminoConfig;
  prefix: string;
  feeAmount: number;
  feegranter: string;
  justification?: string;
}

interface TxDepositInputs {
  isAuthzMode: false;
  basicChainInfo: BasicChainInfo;
  depositer: string;
  proposalId: number;
  amount: number;
  denom: string;
  chainID: string;
  rpc: string;
  rest: string;
  aminoConfig: AminoConfig;
  prefix: string;
  feeAmount: number;
  feegranter: string;
  justification?: string;
}

interface VoteOptionNumber {
  [key: string]: number;
}

interface ProposalsData {
  chainID: string;
  chainName: string;
  chainLogo: string;
  isActive: boolean;
  proposalInfo: {
    proposalTitle: string;
    endTime: string; // voting end time or deposit end time
    proposalId: string;
  };
}

interface SelectedProposal {
  chainID: string;
  proposalId: string;
  isActive: boolean;
}

type HandleInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;

type HandleSelectProposalEvent = ({
  chainID,
  isActive,
  proposalId,
}: {
  proposalId: string;
  chainID: string;
  isActive: boolean;
}) => void;
