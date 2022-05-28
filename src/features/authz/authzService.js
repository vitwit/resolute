import Axios from 'axios';
import { convertPaginationToParams } from '../utils';

const grantToMeURL = '/cosmos/authz/v1beta1/grants/grantee/';
const grantByMeURL = '/cosmos/authz/v1beta1/grants/granter/';

const fetchGrantsToMe = (baseURL, grantee, pagination) => {
  let uri = `${baseURL}${grantToMeURL}${grantee}`
  let parsed = convertPaginationToParams(pagination)
  if (parsed !== "") {
    uri += `?${parsed}`
  }

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
    },
})
}


const fetchGrantsByMe = (baseURL, grantee, pagination) => {
  let uri = `${baseURL}${grantByMeURL}${grantee}`
  let parsed = convertPaginationToParams(pagination)
  if (parsed !== "") {
    uri += `?${parsed}`
  }

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
    },
})
}


const result = {
  grantsByMe: fetchGrantsByMe,
  grantsToMe: fetchGrantsToMe
}

export default result;