'use client';

import Axios, { AxiosResponse } from 'axios';
import { cleanURL } from '../../../utils/util';

const BASE_URL = 'https://api.resolute.vitwit.com';

const fetchPriceInfo = (denom: string): Promise<AxiosResponse> => {
  const uri = `${cleanURL(BASE_URL)}/tokens-info/${denom}`;
  return Axios.get(uri);
};

const fetchAllTokensPriceInfo = (): Promise<AxiosResponse> => {
  const uri = `${cleanURL(BASE_URL)}/tokens-info`;
  return Axios.get(uri);
};

const result = {
  tokenInfo: fetchPriceInfo,
  allTokensInfo: fetchAllTokensPriceInfo,
};

export default result;
