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

export default {
  recentTransactions: fetchRecentTransactions,
  allTransactions: fetchAllTransactions,
};
