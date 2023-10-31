import Axios from 'axios';
import { cleanURL } from '../utils';

const claimRecordsURL = '/passage3d/claim/v1beta1/claim_record/';
const claimParamsURL = '/passage3d/claim/v1beta1/params';

const getClaimRecords = (baseURL, address) => {
  const uri = `${cleanURL(baseURL)}${claimRecordsURL}${address}`
  return Axios.get(uri)
}

const getAirdropDetails = (address) => {
  const uri = `https://api.resolute.vitwit.com/passage-airdrop-details/airdrop-check?address=${address}`
  return Axios.get(uri)
}

const getClaimParams = (baseURL) => {
  const uri = `${cleanURL(baseURL)}${claimParamsURL}`
  return Axios.get(uri)
}

const result = {
    claimRecords: getClaimRecords,
    params: getClaimParams,
    airdropDetails: getAirdropDetails, 
  }
  
  export default result;