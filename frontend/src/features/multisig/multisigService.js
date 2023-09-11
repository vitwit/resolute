import Axios from "axios";
import { getValidURL } from "../utils";

const BASE_URL = getValidURL(process.env.REACT_APP_API_URI);

const CREATE_ACCOUNT = "/multisig";
const GET_ACCOUNTS = "/multisig/accounts";
const MULTI_ACCOUNT_URL = "/accounts";
const TXNS_URL = "/txs";
const SIGN_URL = (address, txId) =>
  `${BASE_URL}/multisig/${address}/sign-tx/${txId}`;

const createAccount = (data) =>
  Axios.post(`${BASE_URL}${CREATE_ACCOUNT}`, data);

const getAccounts = (address) =>
  Axios.get(`${BASE_URL}${GET_ACCOUNTS}/${address}`);

const getAccount = (address) =>
  Axios.get(`${BASE_URL}${CREATE_ACCOUNT}/${address}`);

const signTx = (address, txId, payload) =>
  Axios.post(SIGN_URL(address, txId), payload);

const updateTx = (address, txId, payload) =>
  Axios.post(`${BASE_URL}${CREATE_ACCOUNT}/${address}/tx/${txId}`, payload);

export const fetchMultisigAccounts = (address) => {
  let uri = `${BASE_URL}/accounts/${address}`;

  return Axios.get(uri);
};

export const createTxn = (address, payload) => {
  let uri = `${BASE_URL}/multisig/${address}/tx`;

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

export const deleteTx = (address, txId) =>
  Axios.delete(`${BASE_URL}/multisig/${address}/tx/${txId}`);

export default {
  createAccount: createAccount,
  getAccounts: getAccounts,
  getAccount: getAccount,
  createTxn: createTxn,
  getTxns: getTxns,
  signTx: signTx,
  updateTx: updateTx,
  deleteTx: deleteTx,
};
