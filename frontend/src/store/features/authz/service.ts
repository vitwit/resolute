import { AxiosResponse } from 'axios';
import { convertPaginationToParams } from '@/utils/util';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { MAX_TRY_END_POINTS } from '../../../utils/constants';

const grantToMeURL = '/cosmos/authz/v1beta1/grants/grantee/';
const grantByMeURL = '/cosmos/authz/v1beta1/grants/granter/';

const fetchGrantsToMe = (
  baseURLs: string[],
  grantee: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse<GetGrantsResponse>> => {
  let endPoint = `${grantToMeURL}${grantee}`;

  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    endPoint += `?${parsed}`;
  }

  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const fetchGrantsByMe = (
  baseURLs: string[],
  grantee: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse<GetGrantsResponse>> => {
  let endPoint = `${grantByMeURL}${grantee}`;

  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    endPoint += `?${parsed}`;
  }

  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const result = {
  grantsByMe: fetchGrantsByMe,
  grantsToMe: fetchGrantsToMe,
};

export default result;
