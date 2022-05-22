import Axios from 'axios';
import { convertPaginationToParams } from '../utils';

const balancesURL = 'cosmos/bank/v1beta1/balances/';
const balanceURL =  (address, denom) => { return `/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`};

const fetchBalances = (baseURL,address,pagination) => {
  let uri = `${baseURL}${balancesURL}${address}`
  const parsed = convertPaginationToParams(pagination)
  if (parsed === "") {
    uri += `?${parsed}`
  }

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',        
    },
})
}


const fetchBalance = (baseURL,address, denom) => {
  let uri = `${baseURL}${balanceURL(address, denom)}`

  return Axios.get(uri, {
    headers: {
        Accept: 'application/json, text/plain, */*',
    },
})
}


const result = {
  balances: fetchBalances,
  balance: fetchBalance
}

export default result;