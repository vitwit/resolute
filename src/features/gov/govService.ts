import Axios, { AxiosResponse } from "axios";
import { convertPaginationToParams } from "../utils";

const proposalsURL = "/cosmos/gov/v1beta1/proposals";
const proposalTallyURL = (id: number): string =>
  `/cosmos/gov/v1beta1/proposals/${id}/tally`;

const voterVoteURL = (id: number, voter: string): string =>
  `/cosmos/gov/v1beta1/proposals/${id}/votes/${voter}`;

const fetchProposals = (
  baseURL: string,
  key: string | undefined,
  limit: number
): Promise<AxiosResponse> => {
  let uri = `${baseURL}${proposalsURL}`;
  uri += `?proposal_status=2`;

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
  let uri = `${baseURL}${proposalTallyURL(proposalId)}`;
  return Axios.get(uri);
};

const fetchVoterVote = (
  baseURL: string,
  proposalId: number,
  voter: string,
  key: string | undefined,
  limit: number
): Promise<AxiosResponse> => {
  let uri = `${baseURL}${voterVoteURL(proposalId, voter)}`;
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
  Axios.get(`${baseURL}${proposalsURL}/${proposalId}`);

const result = {
  proposals: fetchProposals,
  tally: fetchProposalTally,
  votes: fetchVoterVote,
  proposal: fetchProposal,
};

export default result;
