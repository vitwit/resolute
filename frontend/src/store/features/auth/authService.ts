import { AxiosResponse } from 'axios';
import { QueryAccountResponse } from 'cosmjs-types/cosmos/auth/v1beta1/query';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { MAX_TRY_END_POINTS } from '@/utils/constants';

const accountInfoURL = '/cosmos/auth/v1beta1/accounts/';

const fetchAccountInfo = (
  baseURLs: string[],
  address: string
): Promise<AxiosResponse<BaseAccountInfoResponse | QueryAccountResponse>> => {
  const endPoint = `${accountInfoURL}${address}`;
  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const result = {
  accountInfo: fetchAccountInfo,
};

export default result;
