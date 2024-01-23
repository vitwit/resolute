import  { AxiosResponse } from 'axios';
import { convertPaginationToParams } from '../../../utils/util';
import {
  GetProposalsInVotingResponse,
  GovProposal,
  ProposalVote,
} from '@/types/gov';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { MAX_TRY_END_POINTS } from '../../../utils/constants';

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
  baseURLs: string[],
  key: string | undefined,
  limit: number | undefined,
  status: number,
  govV1: boolean
): Promise<AxiosResponse<GetProposalsInVotingResponse>> => {
  let endPoint = `${proposalsURL(govV1)}`;

  endPoint += `?proposal_status=${status}`;

  const params = convertPaginationToParams({
    key: key,
    limit: limit,
  });

  if (params !== '') endPoint += `&${params}`;
  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const fetchProposalTally = (
  baseURLs: string[],
  proposalId: number,
  govV1: boolean
): Promise<AxiosResponse> => {
  const endPoint = `${proposalTallyURL(proposalId, govV1)}`;
  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const fetchVoterVote = (
  baseURLs: string[],
  proposalId: number,
  voter: string,
  key: string | undefined,
  limit: number | undefined,
  govV1: boolean
): Promise<AxiosResponse<ProposalVote>> => {
  let endPoint = `${voterVoteURL(proposalId, voter, govV1)}`;
  const params = convertPaginationToParams({
    key: key,
    limit: limit,
  });
  if (params !== '') endPoint += `?${params}`;
  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const fetchProposal = (
  baseURLs: string[],
  proposalId: number,
  govV1: boolean
): Promise<AxiosResponse<{ proposal: GovProposal }>> => {
  const endPoint = `${proposalsURL(govV1)}/${proposalId}`;
  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const fetchDepositParams = (baseURLs: string[]): Promise<AxiosResponse> => {
  const endPoint = `${depositParamsURL}`;
  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const fetchGovTallyParams = (baseURLs: string[]): Promise<AxiosResponse> => {
  const endPoint = `${govTallyParamsURL}`;
  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const result = {
  proposals: fetchProposals,
  tally: fetchProposalTally,
  votes: fetchVoterVote,
  proposal: fetchProposal,
  depositParams: fetchDepositParams,
  govTallyParams: fetchGovTallyParams,
};

export default result;
