import Axios from 'axios';

const claimRecordsURL = '/passage3d/claim/v1beta1/claim_record/';

const getClaimRecords = (baseURL, address) => {
  const uri = `${baseURL}${claimRecordsURL}${address}`
  return Axios.get(uri)
}

const result = {
    claimRecords: getClaimRecords,
  }
  
  export default result;