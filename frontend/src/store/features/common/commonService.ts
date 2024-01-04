'use client';

import Axios, { AxiosResponse } from 'axios';
import { cleanURL } from '../../../utils/util';
import { API_URL } from '@/utils/constants';

const fetchPriceInfo = (denom: string): Promise<AxiosResponse> => {
  const uri = `${cleanURL(API_URL)}/tokens-info/${denom}`;
  return Axios.get(uri);
};

const fetchAllTokensPriceInfo = (): Promise<AxiosResponse> => {
  const uri = `${cleanURL(API_URL)}/tokens-info`;
  return Axios.get(uri);
};

const result = {
  tokenInfo: fetchPriceInfo,
  allTokensInfo: fetchAllTokensPriceInfo,
};

export default result;
