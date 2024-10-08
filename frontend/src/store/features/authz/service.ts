import { AxiosResponse } from 'axios';
import { addChainIDParam, convertPaginationToParams } from '@/utils/util';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';

const grantToMeURL = '/cosmos/authz/v1beta1/grants/grantee/';
const grantByMeURL = '/cosmos/authz/v1beta1/grants/granter/';

const fetchGrantsToMe = (
  baseURLs: string[],
  grantee: string,
  chainID:string,
  pagination?: KeyLimitPagination,
): Promise<AxiosResponse<GetGrantsResponse>> => {
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
  pagination?: KeyLimitPagination,
): Promise<AxiosResponse<GetGrantsResponse>> => {
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
