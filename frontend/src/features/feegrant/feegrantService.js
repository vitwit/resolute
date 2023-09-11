import Axios from 'axios';
import { convertPaginationToParams, getValidURL } from '../utils';

const grantToMeURL = '/cosmos/feegrant/v1beta1/allowances/';
const grantByMeURL = '/cosmos/feegrant/v1beta1/issued/';

const fetchGrantsToMe = (baseURL, grantee, pagination) => {
  let uri = `${getValidURL(baseURL)}${grantToMeURL}${grantee}`
  const parsed = convertPaginationToParams(pagination)
  if (parsed !== "") {
    uri += `?${parsed}`
  }

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
    },
})
}


const fetchGrantsByMe = (baseURL, grantee,pagination) => {
  let uri = `${getValidURL(baseURL)}${grantByMeURL}${grantee}`
  const parsed = convertPaginationToParams(pagination)
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
  grantsToMe: fetchGrantsToMe,
}

export default result;