import Axios from 'axios';

const validatorsURI = '/cosmos/staking/v1beta1/validators';
const delegationsURI = '/cosmos/staking/v1beta1/delegations/';

export function fetchValidators(baseURL, key, limit, status) {
  let uri = `${baseURL}${validatorsURI}`
  if (key != null) {
    uri += `?pagination.key=${key}`
    if (limit > 0) {
      uri += `&pagination.limit=${limit}`
    }
    uri += `&status=${status}`
  } else {
    if (limit > 0) {
      uri += `?pagination.limit=${limit}`
      uri += `&status=${status}`
    }
  }

  if (key == null && limit == 0) {
    uri += `?status=${status}`
  }

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
        Connection: 'keep-alive',
    },
})
}

export function fetchdelegations(baseURL,address, key, limit) {
  let uri = `${baseURL}${delegationsURI}${address}`
  if (key != null) {
    uri += `?pagination.key=${key}`
    if (limit > 0) {
      uri += `&pagination.limit=${limit}`
    }
  } else {
    if (limit > 0) {
      uri += `?pagination.limit=${limit}`
    }
  }

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
        Connection: 'keep-alive',
    },
})
}
