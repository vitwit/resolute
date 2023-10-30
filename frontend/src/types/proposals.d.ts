export interface ProposalsResponse {
  proposals: Proposal[];
  pagination: Pagination;
}

export interface Pagination {
  next_key: string | null;
  total: string;
}

export interface Proposal {
  proposal_id: string;
  content: Content;
  status: string;
  final_tally_result: FinalTallyResult;
  submit_time: Date;
  deposit_end_time: Date;
  total_deposit: TotalDeposit[];
  voting_start_time: Date;
  voting_end_time: Date;
}

export interface Content {
  "@type": string;
  title: string;
  description: string;
  recipient: string;
  amount: TotalDeposit[];
}

export interface TotalDeposit {
  denom: string;
  amount: string;
}

export interface FinalTallyResult {
  yes: string;
  abstain: string;
  no: string;
  no_with_veto: string;
}
