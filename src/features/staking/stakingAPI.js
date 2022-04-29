import Axios from 'axios';

const validatorsURI = '/cosmos/staking/v1beta1/validators';
const delegationsURI = '/cosmos/staking/v1beta1/delegations/';
const unbondingDelegationsURI = (address) => `/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`

export function fetchValidators(baseURL, key1, limit, status) {
  let key = null
  if (key1 != null)
    key = encodeURIComponent(key1)
  let uri = `${baseURL}${validatorsURI}`
  if (key != null) {
    uri += `?pagination.key=${key}`
    if (limit > 0) {
      uri += `&pagination.limit=${limit}`
    }
    if (status != null )uri += `&status=${status}`
  } else {
    if (limit > 0) {
      uri += `?pagination.limit=${limit}`
      if (status != null )uri += `&status=${status}`
    }
  }

  if (key == null && limit === 0) {
    if (status != null )uri += `?status=${status}`
  }

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
        Connection: 'keep-alive',
    },
})
}

export function fetchdelegations(baseURL,address, key1, limit) {
  let key = null
  if (key1 != null)
    key = encodeURIComponent(key1)
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


export function fetchUnbonding(baseURL,address, key1, limit) {
  let key = null
  if (key1 != null)
    key = encodeURIComponent(key1)
  let uri = `${baseURL}${unbondingDelegationsURI(address)}`
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
