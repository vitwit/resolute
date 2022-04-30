import Axios from 'axios';
import { convertPaginationToParams } from '../utils';

const validatorsURL = '/cosmos/staking/v1beta1/validators';
const delegationsURL = '/cosmos/staking/v1beta1/delegations/';
const unbondingDelegationsURL = (address) => `/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`

const fetchValidators = (baseURL, status, pagination) => {
  let uri = `${baseURL}${validatorsURL}`
  
  const pageParams = convertPaginationToParams(pagination)
  if (status !== null ) {
    uri += `?status=${status}`
    if (pageParams !== "") 
    uri += `&${pageParams}`
  } else {
    if (pageParams !== "") 
    uri += `?${pageParams}`
  }

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
        Connection: 'keep-alive',
    },
})
}

const fetchdelegations = (baseURL,address, pagination) => {
  let uri = `${baseURL}${delegationsURL}${address}`
  const pageParams = convertPaginationToParams(pagination)
  if (pageParams !== "")  uri += `?${pageParams}`

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
        Connection: 'keep-alive',
    },
})
}


const fetchUnbonding = (baseURL,address, pagination) => {
  let uri = `${baseURL}${unbondingDelegationsURL(address)}`
  const pageParams = convertPaginationToParams(pagination)
  if (pageParams !== "")  uri += `?${pageParams}`

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
        Connection: 'keep-alive',
    },
})
}


export default {
  validtors: fetchValidators,
  delegations: fetchdelegations,
  unbonding: fetchUnbonding
}