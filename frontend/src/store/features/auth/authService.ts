import Axios, { AxiosResponse } from 'axios';
import { cleanURL } from '@/utils/util';
import { QueryAccountResponse } from 'cosmjs-types/cosmos/auth/v1beta1/query';

const accountInfoURL = '/cosmos/auth/v1beta1/accounts/';

const fetchAccountInfo = (
  baseURL: string,
  address: string
): Promise<AxiosResponse<BaseAccountInfoResponse | QueryAccountResponse>> =>
  Axios.get(`${cleanURL(baseURL)}${accountInfoURL}${address}`);

const result = {
  accountInfo: fetchAccountInfo,
};

export default result;
