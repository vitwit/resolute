'use client';

import Axios, { AxiosResponse } from 'axios';
import { cleanURL } from '../../../utils/util';
import {
  CreateAccountPayload,
  CreateTxnPayload,
  QueryParams,
  SignTxPayload,
  UpdateTxPayload,
  VerifyUserPayload,
} from '@/types/multisig';
import { API_URL } from '@/utils/constants';
import { getAddressByPrefix } from '@/utils/address';
import { SigningStargateClient } from '@cosmjs/stargate';

const BASE_URL: string = cleanURL(API_URL);

const GET_ACCOUNTS_URL = '/multisig/accounts';

const SIGNATURE_PARAMS_STRING = (queryParams: QueryParams): string =>
  `?address=${encodeURIComponent(
    queryParams.address
  )}&cosmos_address=${encodeURIComponent(
    getAddressByPrefix(queryParams.address, 'cosmos')
  )}&signature=${encodeURIComponent(queryParams.signature)}`;

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
  `${BASE_URL}/users/${address}/signature`;

const CREATE_TXN_URL = (address: string, queryParams: QueryParams): string =>
  `${BASE_URL}/multisig/${address}/tx` + SIGNATURE_PARAMS_STRING(queryParams);

const verifyUser = (data: VerifyUserPayload): Promise<AxiosResponse> =>
  Axios.post(`${VERIFY_ACCOUNT_URL(data.address)}`, data);

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

export const getAccountAllMultisigTxns = (
  address: string,
  status: string
): Promise<AxiosResponse> => {
  const uri = `${BASE_URL}/accounts/${address}/all-txns?status=${status}`;
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

export const deleteMultisig = (
  queryParams: QueryParams,
  address: string
): Promise<AxiosResponse> =>
  Axios.delete(
    `${BASE_URL}/multisig/${address}` + SIGNATURE_PARAMS_STRING(queryParams)
  );

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getStargateClient = async (urls: string[]) => {
  for (const url of urls) {
    try {
      const client = await SigningStargateClient.connect(url);
      return client;
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.error(`Error connecting to ${url}: ${error.message}`);
    }
  }
  throw new Error('Unable to connect to any RPC URLs');
};

export default {
  createAccount,
  getAccounts,
  getAccount,
  createTxn,
  getTxns,
  signTx,
  updateTx,
  deleteTx,
  deleteMultisig,
  verifyUser,
  getAccountAllMultisigTxns,
  getStargateClient,
};
