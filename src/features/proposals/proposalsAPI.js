import Axios from 'axios';

const proposalsURI = '/cosmos/gov/v1beta1/proposals';
const proposalTallyURI = (id) => { return `/cosmos/gov/v1beta1/proposals/${id}/tally` }
const voterVoteURI = (id, voter) => { return `/cosmos/gov/v1beta1/proposals/${id}/votes/${voter}` }

export function fetchProposals(baseURL, key, limit) {
  let uri = `${baseURL}${proposalsURI}`
  uri += `?proposal_status=2`
  if (key != null) {
    uri += `&pagination.key=${key}`
    if (limit > 0) {
      uri += `&pagination.limit=${limit}`
    }
  } else {
    if (limit > 0) {
      uri += `&pagination.limit=${limit}`
    }
  }

  return Axios.get(uri, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      Connection: 'keep-alive',
    },
  })
}


export function fetchProposalTally(baseURL, proposalId) {
  let uri = `${baseURL}${proposalTallyURI(proposalId)}`
  return Axios.get(uri, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      Connection: 'keep-alive',
    },
  })
}

export function fetchVoterVote(baseURL, proposalId, voter) {
  let uri = `${baseURL}${voterVoteURI(proposalId, voter)}`
  return Axios.get(uri, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      Connection: 'keep-alive',
    },
  })
}
