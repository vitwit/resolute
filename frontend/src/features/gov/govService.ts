import Axios, { AxiosResponse } from "axios";
import { convertPaginationToParams, getValidURL } from "../utils";

const proposalsURL = "/cosmos/gov/v1beta1/proposals";
const proposalTallyURL = (id: number): string =>
  `/cosmos/gov/v1beta1/proposals/${id}/tally`;

const voterVoteURL = (id: number, voter: string): string =>
  `/cosmos/gov/v1beta1/proposals/${id}/votes/${voter}`;

const depositParamsURL = `/cosmos/gov/v1beta1/params/deposit`;

const fetchProposals = (
  baseURL: string,
  key: string | undefined,
  limit: number,
  status: number
): Promise<AxiosResponse> => {
  let uri = `${getValidURL(baseURL)}${proposalsURL}`;
  uri += `?proposal_status=${status}`;

  const params = convertPaginationToParams({
    key: key,
    limit: limit,
  });

  if (params !== "") uri += `&${params}`;
  return Axios.get(uri);
};

const fetchProposalTally = (
  baseURL: string,
  proposalId: number
): Promise<AxiosResponse> => {
  let uri = `${getValidURL(baseURL)}${proposalTallyURL(proposalId)}`;
  return Axios.get(uri);
};

const fetchVoterVote = (
  baseURL: string,
  proposalId: number,
  voter: string,
  key: string | undefined,
  limit: number
): Promise<AxiosResponse> => {
  let uri = `${getValidURL(baseURL)}${voterVoteURL(proposalId, voter)}`;
  const params = convertPaginationToParams({
    key: key,
    limit: limit,
  });
  if (params !== "") uri += `?${params}`;

  return Axios.get(uri);
};

const fetchProposal = (
  baseURL: string,
  proposalId: number
): Promise<AxiosResponse> =>
  Axios.get(`${getValidURL(baseURL)}${proposalsURL}/${proposalId}`);

const fetchDepositParams = (baseURL: string): Promise<AxiosResponse> =>
  Axios.get(`${getValidURL(baseURL)}${depositParamsURL}`);

const result = {
  proposals: fetchProposals,
  tally: fetchProposalTally,
  votes: fetchVoterVote,
  proposal: fetchProposal,
  depositParams: fetchDepositParams,
};

export default result;
