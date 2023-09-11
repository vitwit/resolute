import Axios from 'axios';
import { getValidURL } from '../utils';

const claimRecordsURL = '/passage3d/claim/v1beta1/claim_record/';
const claimParamsURL = '/passage3d/claim/v1beta1/params';

const getClaimRecords = (baseURL, address) => {
  const uri = `${getValidURL(baseURL)}${claimRecordsURL}${address}`
  return Axios.get(uri)
}

const getClaimParams = (baseURL) => {
  const uri = `${getValidURL(baseURL)}${claimParamsURL}`
  return Axios.get(uri)
}

const result = {
    claimRecords: getClaimRecords,
    params: getClaimParams,
  }
  
  export default result;