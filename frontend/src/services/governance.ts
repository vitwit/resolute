import { ProposalsResponse } from "../types/proposals";
import { convertPaginationToParams, cleanURL } from "../utils/util";

const proposalsURL = "/cosmos/gov/v1beta1/proposals";
const proposalTallyURL = (id: number): string =>
  `/cosmos/gov/v1beta1/proposals/${id}/tally`;

const voterVoteURL = (id: number, voter: string): string =>
  `/cosmos/gov/v1beta1/proposals/${id}/votes/${voter}`;

const depositParamsURL = `/cosmos/gov/v1beta1/params/deposit`;

const fetchProposals = async (
  baseURL: string,
  key: string | undefined,
  limit: number,
  status: number
): Promise<ProposalsResponse> => {
  let uri = `${cleanURL(baseURL)}${proposalsURL}`;
  uri += `?proposal_status=${status}`;

  const params = convertPaginationToParams({
    key: key,
    limit: limit,
  });

  if (params !== "") uri += `&${params}`;

  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error("Failed to fetch proposals");
  }

  const data = await response.json();

  const proposalsResponse: ProposalsResponse = {
    proposals: data.proposals,
    pagination: data.pagination,
  };

  return proposalsResponse;
};

const fetchProposalTally = async (
  baseURL: string,
  proposalId: number
): Promise<Response> => {
  let uri = `${cleanURL(baseURL)}${proposalTallyURL(proposalId)}`;
  return await fetch(uri);
};

const fetchVoterVote = async (
  baseURL: string,
  proposalId: number,
  voter: string,
  key: string | undefined,
  limit: number
): Promise<Response> => {
  let uri = `${cleanURL(baseURL)}${voterVoteURL(proposalId, voter)}`;
  const params = convertPaginationToParams({
    key: key,
    limit: limit,
  });
  if (params !== "") uri += `?${params}`;

  return await fetch(uri);
};

const fetchProposal = async (
  baseURL: string,
  proposalId: number
): Promise<Response> =>
  await fetch(`${cleanURL(baseURL)}${proposalsURL}/${proposalId}`);

const fetchDepositParams = async (baseURL: string): Promise<Response> =>
  await fetch(`${cleanURL(baseURL)}${depositParamsURL}`);


export const getProposalsInVoting = async (data: {
  baseURL: string;
  key: string | undefined;
  limit: number;
}): Promise<ProposalsResponse> => {
  const response = await fetchProposals(data.baseURL, data.key, data.limit, 2);

  return response;
};

const result = {
    proposals: fetchProposals,
    tally: fetchProposalTally,
    votes: fetchVoterVote,
    proposal: fetchProposal,
    depositParams: fetchDepositParams,
    proposalsInVoting: getProposalsInVoting,
  };

export default result;
