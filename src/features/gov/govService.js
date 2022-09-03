import Axios from "axios";

const proposalsURL = "/cosmos/gov/v1beta1/proposals";
const proposalTallyURL = (id) => {
  return `/cosmos/gov/v1beta1/proposals/${id}/tally`;
};
const voterVoteURL = (id, voter) => {
  return `/cosmos/gov/v1beta1/proposals/${id}/votes/${voter}`;
};

const fetchProposals = (baseURL, key, limit) => {
  let uri = `${baseURL}${proposalsURL}`;
  uri += `?proposal_status=2`;
  if (key != null) {
    uri += `&pagination.key=${key}`;
    if (limit > 0) {
      uri += `&pagination.limit=${limit}`;
    }
  } else {
    if (limit > 0) {
      uri += `&pagination.limit=${limit}`;
    }
  }

  return Axios.get(uri, {
    headers: {
      Accept: "application/json, text/plain, */*",
    },
  });
};

const fetchProposalTally = (baseURL, proposalId) => {
  let uri = `${baseURL}${proposalTallyURL(proposalId)}`;
  return Axios.get(uri, {
    headers: {
      Accept: "application/json, text/plain, */*",
    },
  });
};

const fetchVoterVote = (baseURL, proposalId, voter, key, limit) => {
  let uri = `${baseURL}${voterVoteURL(proposalId, voter)}`;
  if (key != null) {
    uri += `?pagination.key=${key}`;
    if (limit > 0) {
      uri += `&pagination.limit=${limit}`;
    }
  } else {
    if (limit > 0) {
      uri += `?pagination.limit=${limit}`;
    }
  }
  return Axios.get(uri, {
    headers: {
      Accept: "application/json, text/plain, */*",
    },
  });
};

const fetchProposal = (baseURL, proposalId) =>
  Axios.get(`${baseURL}${proposalsURL}/${proposalId}`, {
    headers: {
      Accept: "application/json, text/plain, */*",
    },
  });

const result = {
  proposals: fetchProposals,
  tally: fetchProposalTally,
  votes: fetchVoterVote,
  proposal: fetchProposal,
};

export default result;
