'use client';

import { API_URL } from '@/utils/constants';
import { cleanURL } from '@/utils/util';
import Axios, { AxiosResponse } from 'axios';

const BASE_URL = cleanURL(API_URL);

const RECENT_TXNS_URL = (module: string) => `/transactions?module=${module}`;

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

export default {
  recentTransactions: fetchRecentTransactions,
};
