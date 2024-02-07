import Axios from 'axios';
import { cleanURL } from './util';

import axiosRetry from 'axios-retry';
import { AXIOS_RETRIES_COUNT } from './constants';

axiosRetry(Axios, {
  retries: AXIOS_RETRIES_COUNT,
});

axiosRetry(Axios, { retryDelay: (retryCount) => {
  return retryCount * 2000;
}});

const timer = (ms: number) => new Promise(res => setTimeout(res, ms))

/* to make axios requests one by one until any one of them returns a valid response */

export const axiosGetRequestWrapper = async (
  baseURIs: string[],
  endPoint: string,
  limit: number
) => {
  let errMsg = '';

  limit = Math.min(limit, baseURIs.length);
  for (let i = 0; i < limit; i++) {
    try {
      const uri = `${cleanURL(baseURIs[i])}${endPoint}`;
      return await Axios.get(uri);
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      errMsg = err.message;
    }

    await timer(10000)
  }

  throw new Error('All requests failed: ' + errMsg);
};