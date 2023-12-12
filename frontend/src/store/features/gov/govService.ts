import Axios, { AxiosResponse } from 'axios';
import { convertPaginationToParams, cleanURL } from '../../../utils/util';
import {
  GetProposalsInVotingResponse,
  GovProposal,
  ProposalVote,
} from '@/types/gov';

const proposalsURL = '/cosmos/gov/v1beta1/proposals';
const proposalTallyURL = (id: number): string =>
  `/cosmos/gov/v1beta1/proposals/${id}/tally`;

const voterVoteURL = (id: number, voter: string): string =>
  `/cosmos/gov/v1beta1/proposals/${id}/votes/${voter}`;

const depositParamsURL = `/cosmos/gov/v1beta1/params/deposit`;

const govTallyParamsURL = `/cosmos/gov/v1beta1/params/tallying`;

const fetchProposals = (
  baseURL: string,
  key: string | undefined,
  limit: number | undefined,
  status: number
): Promise<AxiosResponse<GetProposalsInVotingResponse>> => {
  let uri = `${cleanURL(baseURL)}${proposalsURL}`;
  uri += `?proposal_status=${status}`;

  const params = convertPaginationToParams({
    key: key,
    limit: limit,
  });

  if (params !== '') uri += `&${params}`;
  return Axios.get(uri);
};

const fetchProposalTally = (
  baseURL: string,
  proposalId: number
): Promise<AxiosResponse> => {
  const uri = `${cleanURL(baseURL)}${proposalTallyURL(proposalId)}`;
  return Axios.get(uri);
};

const fetchVoterVote = (
  baseURL: string,
  proposalId: number,
  voter: string,
  key: string | undefined,
  limit: number | undefined
): Promise<AxiosResponse<ProposalVote>> => {
  let uri = `${cleanURL(baseURL)}${voterVoteURL(proposalId, voter)}`;
  const params = convertPaginationToParams({
    key: key,
    limit: limit,
  });
  if (params !== '') uri += `?${params}`;
  return Axios.get(uri);
};

const fetchProposal = (
  baseURL: string,
  proposalId: number
): Promise<AxiosResponse<{ proposal: GovProposal }>> =>
  Axios.get(`${cleanURL(baseURL)}${proposalsURL}/${proposalId}`);

const fetchDepositParams = (baseURL: string): Promise<AxiosResponse> =>
  Axios.get(`${cleanURL(baseURL)}${depositParamsURL}`);

const fetchGovTallyParams = (baseURL: string): Promise<AxiosResponse> =>
  Axios.get(`${cleanURL(baseURL)}${govTallyParamsURL}`);

const result = {
  proposals: fetchProposals,
  tally: fetchProposalTally,
  votes: fetchVoterVote,
  proposal: fetchProposal,
  depositParams: fetchDepositParams,
  govTallyParams: fetchGovTallyParams,
};

export default result;
