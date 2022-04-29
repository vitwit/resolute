import Axios from 'axios';

const delegatorTotalRewardsURI = (address) => {
  return `/cosmos/distribution/v1beta1/delegators/${address}/rewards`
};

export function fetchDelegatorTotalRewards(baseURL,address, key, limit) {
  let uri = `${baseURL}${delegatorTotalRewardsURI(address)}`
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
