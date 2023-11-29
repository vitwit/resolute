'use client';

import Axios, { AxiosPromise, AxiosResponse } from 'axios';
import { cleanURL } from '../../../utils/util';
import {
  CreateAccountPayload,
  CreateTxnPayload,
  QueryParams,
  SignTxPayload,
  UpdateTxPayload,
  VerifyUserPayload,
} from '@/types/multisig';

const BASE_URL: string = cleanURL('https://api.resolute.vitwit.com');

const GET_ACCOUNTS_URL = '/multisig/accounts';

const SIGNATURE_PARAMS_STRING = (queryParams: QueryParams): string =>
  `?address=${queryParams.address}&signature=${queryParams.signature}`;

const CREATE_ACCOUNT = (queryParams: QueryParams): string =>
  `/multisig` + SIGNATURE_PARAMS_STRING(queryParams);

const SIGN_URL = (
  queryParams: QueryParams,
  address: string,
  txId: number
): string =>
  `${BASE_URL}/multisig/${address}/sign-tx/${txId}` +
  SIGNATURE_PARAMS_STRING(queryParams);

const VERIFY_ACCOUNT_URL = (address: string): string =>
  `/users/${address}/signature`;

const CREATE_TXN_URL = (address: string, queryParams: QueryParams): string =>
  `${BASE_URL}/multisig/${address}/tx` + SIGNATURE_PARAMS_STRING(queryParams);

const verifyUser = (data: VerifyUserPayload): Promise<AxiosPromise> =>
  Axios.post(`${BASE_URL}${VERIFY_ACCOUNT_URL(data.address)}`, data);

//TODO: Create interface for 'data'
const createAccount = (
  queryParams: QueryParams,
  data: CreateAccountPayload
): Promise<AxiosResponse> =>
  Axios.post(`${BASE_URL}${CREATE_ACCOUNT(queryParams)}`, data);

const getAccounts = (address: string): Promise<AxiosResponse> =>
  Axios.get(`${BASE_URL}${GET_ACCOUNTS_URL}/${address}`);

const getAccount = (address: string): Promise<AxiosResponse> =>
  Axios.get(`${BASE_URL}/multisig/${address}`);

const createTxn = (
  queryParams: QueryParams,
  address: string,
  payload: CreateTxnPayload
): Promise<AxiosResponse> => {
  const uri = CREATE_TXN_URL(address, queryParams);
  return Axios.post(uri, payload);
};

const signTx = (
  queryParams: QueryParams,
  address: string,
  txId: number,
  payload: SignTxPayload
): Promise<AxiosResponse> =>
  Axios.post(SIGN_URL(queryParams, address, txId), payload);

const updateTx = (
  queryParams: QueryParams,
  address: string,
  txId: number,
  payload: UpdateTxPayload
): Promise<AxiosResponse> =>
  Axios.post(
    `${BASE_URL}/multisig/${address}/tx/${txId}` +
      SIGNATURE_PARAMS_STRING(queryParams),
    payload
  );

export const getTxns = (
  address: string,
  status: string
): Promise<AxiosResponse> => {
  const uri = `${BASE_URL}/multisig/${address}/txs?status=${status}`;
  return Axios.get(uri);
};

export const deleteTx = (
  queryParams: QueryParams,
  address: string,
  txId: number
): Promise<AxiosResponse> =>
  Axios.delete(
    `${BASE_URL}/multisig/${address}/tx/${txId}` +
      SIGNATURE_PARAMS_STRING(queryParams)
  );

export default {
  createAccount,
  getAccounts,
  getAccount,
  createTxn,
  getTxns,
  signTx,
  updateTx,
  deleteTx,
  verifyUser,
};
