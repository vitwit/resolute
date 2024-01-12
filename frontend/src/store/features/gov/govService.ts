import Axios, { AxiosResponse } from 'axios';
import { convertPaginationToParams, cleanURL } from '../../../utils/util';
import {
  GetProposalsInVotingResponse,
  GovProposal,
  ProposalVote,
} from '@/types/gov';

const proposalsURL = (govV1: boolean) =>
  govV1 ? '/cosmos/gov/v1/proposals' : '/cosmos/gov/v1beta1/proposals';
const proposalTallyURL = (id: number, govV1: boolean): string =>
  govV1
    ? `/cosmos/gov/v1/proposals/${id}/tally`
    : `/cosmos/gov/v1beta1/proposals/${id}/tally`;

const voterVoteURL = (id: number, voter: string, govV1: boolean): string =>
  govV1
    ? `/cosmos/gov/v1/proposals/${id}/votes/${voter}`
    : `/cosmos/gov/v1beta1/proposals/${id}/votes/${voter}`;

const depositParamsURL = `/cosmos/gov/v1beta1/params/deposit`;

const govTallyParamsURL = `/cosmos/gov/v1beta1/params/tallying`;

const fetchProposals = (
  baseURL: string,
  key: string | undefined,
  limit: number | undefined,
  status: number,
  govV1: boolean
): Promise<AxiosResponse<GetProposalsInVotingResponse>> => {
  let uri = `${cleanURL(baseURL)}${proposalsURL(govV1)}`;
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
  proposalId: number,
  govV1: boolean
): Promise<AxiosResponse> => {
  const uri = `${cleanURL(baseURL)}${proposalTallyURL(proposalId, govV1)}`;
  return Axios.get(uri);
};

const fetchVoterVote = (
  baseURL: string,
  proposalId: number,
  voter: string,
  key: string | undefined,
  limit: number | undefined,
  govV1: boolean
): Promise<AxiosResponse<ProposalVote>> => {
  let uri = `${cleanURL(baseURL)}${voterVoteURL(proposalId, voter, govV1)}`;
  const params = convertPaginationToParams({
    key: key,
    limit: limit,
  });
  if (params !== '') uri += `?${params}`;
  return Axios.get(uri);
};

const fetchProposal = (
  baseURL: string,
  proposalId: number,
  govV1: boolean
): Promise<AxiosResponse<{ proposal: GovProposal }>> =>
  Axios.get(`${cleanURL(baseURL)}${proposalsURL(govV1)}/${proposalId}`);

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
