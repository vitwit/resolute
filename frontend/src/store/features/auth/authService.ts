import { AxiosResponse } from 'axios';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { addChainIDParam } from '@/utils/util';

const accountInfoURL = '/cosmos/auth/v1beta1/accounts/';

const fetchAccountInfo = (
  baseURLs: string[],
  address: string,
  chainID: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> => {
  let endPoint = `${accountInfoURL}${address}`;
  endPoint = addChainIDParam(endPoint, chainID);

  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const result = {
  accountInfo: fetchAccountInfo,
};

export default result;
