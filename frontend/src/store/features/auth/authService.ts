import Axios, { AxiosResponse } from 'axios';
import { cleanURL } from '@/utils/util';
const accountInfoURL = '/cosmos/auth/v1beta1/accounts/';

const fetchAccountInfo = (
  baseURL: string,
  address: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> =>
  Axios.get(`${cleanURL(baseURL)}${accountInfoURL}${address}`);

const result = {
  accountInfo: fetchAccountInfo,
};

export default result;
