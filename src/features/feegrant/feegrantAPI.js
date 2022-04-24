import Axios from 'axios';

const grantToMeURI = '/cosmos/feegrant/v1beta1/allowances/';
const grantByMeURI = '/cosmos/feegrant/v1beta1/issued/';

export function fetchGrantsToMe(baseURL, grantee, key, limit) {
  let uri = `${baseURL}${grantToMeURI}${grantee}`
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


export function fetchGrantsByMe(baseURL, grantee, key, limit) {
  let uri = `${baseURL}${grantByMeURI}${grantee}`
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
