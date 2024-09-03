'use client';

import { API_URL } from '@/utils/constants';
import { cleanURL } from '@/utils/util';
import Axios, { AxiosResponse } from 'axios';

const BASE_URL = cleanURL(API_URL);

const RECENT_TXNS_URL = (module: string) => `/transactions?module=${module}`;
const ALL_TXNS_URL = (
  address: string,
  chainID: string,
  limit: number,
  offset: number
) => `/txns/${chainID}/${address}?limit=${limit}&offset=${offset}`;

const TXN_URL = (address: string, chainID: string, txhash: string) =>
  `/txns/${chainID}/${address}/${txhash}`;

const ANY_CHAIN_TX_URL = (txHash: string) => `/search/txns/${txHash}`;

export const fetchRecentTransactions = ({
  payload,
  module,
}: {
  payload: {
    chain_id: string;
    address: string;
  }[];
  module: string;
}): Promise<AxiosResponse> =>
  Axios.post(`${BASE_URL}${RECENT_TXNS_URL(module)}`, { addresses: payload });

export const fetchAllTransactions = ({
  address,
  chainID,
  limit,
  offset,
}: {
  address: string;
  chainID: string;
  limit: number;
  offset: number;
}): Promise<AxiosResponse> =>
  Axios.get(`${BASE_URL}${ALL_TXNS_URL(address, chainID, limit, offset)}`);

export const fetchTx = ({
  address,
  chainID,
  txhash,
}: {
  address: string;
  chainID: string;
  txhash: string;
}): Promise<AxiosResponse> =>
  Axios.get(`${BASE_URL}${TXN_URL(address, chainID, txhash)}`);

export const fetchAnyChainTx = (txHash: string): Promise<AxiosResponse> =>
  Axios.get(`${BASE_URL}${ANY_CHAIN_TX_URL(txHash)}`);

export default {
  recentTransactions: fetchRecentTransactions,
  allTransactions: fetchAllTransactions,
  fetchTx: fetchTx,
  fetchAnyChainTx,
};
