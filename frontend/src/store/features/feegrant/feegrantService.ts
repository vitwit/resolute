import { AxiosResponse } from 'axios';
import { convertPaginationToParams } from '@/utils/util';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';

const grantToMeURL = '/cosmos/feegrant/v1beta1/allowances/';
const grantByMeURL = '/cosmos/feegrant/v1beta1/issued/';

const fetchGrantsToMe = (
  baseURLs: string[],
  grantee: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse<GetFeegrantsResponse>> => {
  let endPoint = `${grantToMeURL}${grantee}`;

  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    endPoint += `?${parsed}`;
  }

  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const fetchGrantsByMe = (
  baseURLs: string[],
  grantee: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse<GetFeegrantsResponse>> => {
  let endPoint = `${grantByMeURL}${grantee}`;

  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    endPoint += `?${parsed}`;
  }

  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const result = {
  grantsByMe: fetchGrantsByMe,
  grantsToMe: fetchGrantsToMe,
};

export default result;
