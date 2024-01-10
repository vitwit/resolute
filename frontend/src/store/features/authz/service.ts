import Axios, { AxiosResponse } from 'axios';
import { convertPaginationToParams, cleanURL } from '@/utils/util';
import { GetGrantsResponse } from '@/types/authz';

const grantToMeURL = '/cosmos/authz/v1beta1/grants/grantee/';
const grantByMeURL = '/cosmos/authz/v1beta1/grants/granter/';

const fetchGrantsToMe = (
  baseURL: string,
  grantee: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse<GetGrantsResponse>> => {
  let uri = `${cleanURL(baseURL)}${grantToMeURL}${grantee}`;
  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    uri += `?${parsed}`;
  }

  return Axios.get(uri);
};

const fetchGrantsByMe = (
  baseURL: string,
  grantee: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse<GetGrantsResponse>> => {
  let uri = `${cleanURL(baseURL)}${grantByMeURL}${grantee}`;
  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    uri += `?${parsed}`;
  }

  return Axios.get(uri);
};

const result = {
  grantsByMe: fetchGrantsByMe,
  grantsToMe: fetchGrantsToMe,
};

export default result;
