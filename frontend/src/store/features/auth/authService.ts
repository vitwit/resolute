import { AxiosResponse } from 'axios';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';

const accountInfoURL = '/cosmos/auth/v1beta1/accounts/';

const fetchAccountInfo = (
  baseURLs: string[],
  address: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> => {
  const endPoint = `${accountInfoURL}${address}`;
  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const result = {
  accountInfo: fetchAccountInfo,
};

export default result;
