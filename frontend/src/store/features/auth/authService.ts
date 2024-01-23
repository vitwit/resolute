import { AxiosResponse } from 'axios';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { MAX_TRY_END_POINTS } from '@/utils/constants';

const accountInfoURL = '/cosmos/auth/v1beta1/accounts/';

const fetchAccountInfo = (
  baseURLs: string[],
  address: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> => {
  const endPoint = `${accountInfoURL}${address}`;
  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const result = {
  accountInfo: fetchAccountInfo,
};

export default result;
