import Axios from 'axios';

const balancesURI = 'cosmos/bank/v1beta1/balances/';
const balanceURI =  (address, denom) => { return `cosmos/bank/v1beta1/balances/${address}/by_denom/?${denom}`};

export function fetchBalances(baseURL,address, key, limit) {
  let uri = `${baseURL}${balancesURI}${address}`
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


export function fetchBalance(baseURL,address, denom) {
  let uri = `${baseURL}${balanceURI(address, denom)}`

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
        Connection: 'keep-alive',
    },
})
}
