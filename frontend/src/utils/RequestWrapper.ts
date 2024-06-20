import Axios from 'axios';
import { cleanURL } from './util';

export const axiosGetRequestWrapper = async (
  baseURIs: string[],
  endPoint: string
) => {
  let errMsg = '';

  try {
    const uri = `${cleanURL(baseURIs[0])}${endPoint}`;
    return await Axios.get(uri);
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (err: any) {
    errMsg = err.message;
  }

  throw new Error(errMsg);
};
