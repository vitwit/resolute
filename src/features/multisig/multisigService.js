import Axios from 'axios';
const ACCOUNT_URL = '/accounts';
const MULTI_ACCOUNT_URL = '/multisig/accounts';
const TXNS_URL = '/txs';
const SIGN_URL = '/signs';
const DELEGATOR_VALIDATORS = `/cosmos/staking/v1beta1/delegators`;
const BASE_URL = process.env.NEXT_MULTISIG_API || 'http://192.168.1.53:1323';

export const createMultisigAccount = (data) => {
    let uri = `${BASE_URL}${ACCOUNT_URL}`

    return Axios.post(uri, data)
}

export const fetchMultisigAccounts = (address) => {
    let uri = `${BASE_URL}${ACCOUNT_URL}/${address}`

    return Axios.get(uri)
}

export const fetchMultisigAccountByAddress = (address) => {
    let uri = `${BASE_URL}${MULTI_ACCOUNT_URL}/${address}`
    console.log('uriiiiiiiii', uri)

    return Axios.get(uri)
}

export const fetchMultisigAccount = (address) => {
    let uri = `${BASE_URL}${ACCOUNT_URL}/${address}`

    return Axios.get(uri)
}

export const createTransaction = (data) => {
    let uri = `${BASE_URL}${TXNS_URL}`

    return Axios.post(uri, data)
}

export const fetchTransactins = (address, status='current') => {
    let uri = `${BASE_URL}${TXNS_URL}?address=${address}&status=${status}`

    return Axios.get(uri)
}

export const updateTransaction = (txId) => {
    let uri = `${BASE_URL}${TXNS_URL}/${txId}/update`

    return Axios.post(uri)
}

export const fetchTransaction = (txId) => {
    let uri = `${BASE_URL}${TXNS_URL}/${txId}`

    return Axios.get(uri)
}

export const createSignature = (data) => {
    let uri = `${BASE_URL}${SIGN_URL}`

    return Axios.post(uri, data)
}

export const fetchSignatures = (multisigAddress, txId) => {
    let uri = `${BASE_URL}${SIGN_URL}?multisigAddress=${multisigAddress}&txId=${txId}`

    return Axios.get(uri)
}

export const fetchDelegatorValidators = (lcdUrl, delegatorAddress) => {
    let uri = `${lcdUrl}${DELEGATOR_VALIDATORS}/${delegatorAddress}/validators`
  
    return Axios.get(uri, {
      headers: {
          Accept: 'application/json, text/plain, */*',
      },
  })
}