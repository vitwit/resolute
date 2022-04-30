import Axios from 'axios';
import { convertPaginationToParams } from '../utils';

const delegatorTotalRewardsURL = (address) => {
  return `/cosmos/distribution/v1beta1/delegators/${address}/rewards`
};

export function fetchDelegatorTotalRewards(baseURL,address, pagination) {
  let uri = `${baseURL}${delegatorTotalRewardsURL(address)}`
  const parsed = convertPaginationToParams(pagination)
  if (parsed !== "") {
    uri += `?${parsed}`
  }

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
        Connection: 'keep-alive',
    },
})
}


const result = {
  delegatorRewards: fetchDelegatorTotalRewards
}

export default result;