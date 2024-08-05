import { AxiosResponse } from 'axios';
import { addChainIDParam, convertPaginationToParams } from '@/utils/util';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';

const grantToMeURL = '/cosmos/feegrant/v1beta1/allowances/';
const grantByMeURL = '/cosmos/feegrant/v1beta1/issued/';

const fetchGrantsToMe = (
  baseURLs: string[],
  grantee: string,
  chainID: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse<GetFeegrantsResponse>> => {
  let endPoint = `${grantToMeURL}${grantee}`;

  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    endPoint += `?${parsed}`;
  }
  endPoint = addChainIDParam(endPoint, chainID);

  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const fetchGrantsByMe = (
  baseURLs: string[],
  grantee: string,
  chainID: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse<GetFeegrantsResponse>> => {
  let endPoint = `${grantByMeURL}${grantee}`;

  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    endPoint += `?${parsed}`;
  }
  endPoint = addChainIDParam(endPoint, chainID);

  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const result = {
  grantsByMe: fetchGrantsByMe,
  grantsToMe: fetchGrantsToMe,
};

export default result;
