import Axios from "axios";
import { cleanURL } from "../utils";

const BASE_URL = cleanURL(process.env.REACT_APP_API_URI);

const SIGNATURE_PARAMS_STRING = (queryParams) =>
  `?address=${queryParams.address}&signature=${queryParams.signature}`;
const CREATE_ACCOUNT = (queryParams) =>
  `/multisig` + SIGNATURE_PARAMS_STRING(queryParams);
const GET_ACCOUNTS = "/multisig/accounts";
const MULTI_ACCOUNT_URL = "/accounts";
const TXNS_URL = "/txs";
const SIGN_URL = (queryParams, address, txId) =>
  `${BASE_URL}/multisig/${address}/sign-tx/${txId}` +
  SIGNATURE_PARAMS_STRING(queryParams);
const VERIFY_ACCOUNT_URL = (address) => `/users/${address}/signature`;
const CREATE_TXN_URL = (address, queryParams) =>
  `${BASE_URL}/multisig/${address}/tx` + SIGNATURE_PARAMS_STRING(queryParams);

const createAccount = (queryParams, data) =>
  Axios.post(`${BASE_URL}${CREATE_ACCOUNT(queryParams)}`, data);

const verifyUser = (data) =>
  Axios.post(`${BASE_URL}${VERIFY_ACCOUNT_URL(data.address)}`, data);

const getAccounts = (address) =>
  Axios.get(`${BASE_URL}${GET_ACCOUNTS}/${address}`);

const getAccount = (address) => Axios.get(`${BASE_URL}/multisig/${address}`);

const signTx = (queryParams, address, txId, payload) =>
  Axios.post(SIGN_URL(queryParams, address, txId), payload);

const updateTx = (queryParams, address, txId, payload) =>
  Axios.post(
    `${BASE_URL}/multisig/${address}/tx/${txId}` +
      SIGNATURE_PARAMS_STRING(queryParams),
    payload
  );

export const fetchMultisigAccounts = (address) => {
  let uri = `${BASE_URL}/accounts/${address}`;

  return Axios.get(uri);
};

export const createTxn = (queryParams, address, payload) => {
  let uri = CREATE_TXN_URL(address, queryParams);

  return Axios.post(uri, payload);
};

export const getTxns = (address, payload) => {
  let uri = `${BASE_URL}/multisig/${address}/txs?status=${payload.status}`;

  return Axios.get(uri, payload);
};

export const fetchMultisigAccountByAddress = (address) => {
  let uri = `${BASE_URL}${MULTI_ACCOUNT_URL}/${address}`;
  return Axios.get(uri);
};

export const fetchMultisigAccount = (address) => {
  let uri = `${BASE_URL}${CREATE_ACCOUNT}/${address}`;

  return Axios.get(uri);
};

export const createTransaction = (data) => {
  let uri = `${BASE_URL}${TXNS_URL}`;

  return Axios.post(uri, data);
};

export const deleteTx = (queryParams, address, txId) =>
  Axios.delete(
    `${BASE_URL}/multisig/${address}/tx/${txId}` +
      SIGNATURE_PARAMS_STRING(queryParams)
  );

export default {
  createAccount: createAccount,
  getAccounts: getAccounts,
  getAccount: getAccount,
  createTxn: createTxn,
  getTxns: getTxns,
  signTx: signTx,
  updateTx: updateTx,
  deleteTx: deleteTx,
  verifyUser: verifyUser,
};
