'use client';

import  { AxiosResponse } from 'axios';
import { convertPaginationToParams } from '../../../utils/util';
import {
  GetDelegationsResponse,
  GetParamsResponse,
  GetUnbondingResponse,
  GetValidatorsResponse,
} from '../../../types/staking';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { MAX_TRY_END_POINTS } from '@/utils/constants';
/* disable eslint*/
const validatorsURL = '/cosmos/staking/v1beta1/validators';
const delegationsURL = '/cosmos/staking/v1beta1/delegations/';
const unbondingDelegationsURL = (address: string) =>
  `/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`;
const paramsURL = '/cosmos/staking/v1beta1/params';
const poolURL = '/cosmos/staking/v1beta1/pool';

const fetchValidators = (
  baseURLs: string[],
  status?: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse<GetValidatorsResponse>> => {
  let endPoint = `${validatorsURL}`;

  const pageParams = convertPaginationToParams(pagination);
  if (status) {
    endPoint += `?status=${status}`;
    if (pageParams) endPoint += `&${pageParams}`;
  } else {
    if (pageParams) endPoint += `?${pageParams}`;
  }

  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const fetchdelegations = (
  baseURLs: string[],
  address: string,
  pagination: KeyLimitPagination
): Promise<AxiosResponse<GetDelegationsResponse>> => {
  let endPoint = `${delegationsURL}${address}`;
  const pageParams = convertPaginationToParams(pagination);
  if (pageParams !== '') endPoint += `?${pageParams}`;

  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const fetchUnbonding = async (
  baseURLs: string[],
  address: string
): Promise<AxiosResponse<GetUnbondingResponse>> => {
  const endPoint = `${unbondingDelegationsURL(address)}`;

  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const fetchParams = (
  baseURLs: string[]
): Promise<AxiosResponse<GetParamsResponse>> =>
  axiosGetRequestWrapper(baseURLs, paramsURL, MAX_TRY_END_POINTS);

const fetchPoolInfo = (baseURLs: string[]): Promise<AxiosResponse> =>
  axiosGetRequestWrapper(baseURLs, poolURL, MAX_TRY_END_POINTS);

const result = {
  validators: fetchValidators,
  delegations: fetchdelegations,
  unbonding: fetchUnbonding,
  params: fetchParams,
  poolInfo: fetchPoolInfo,
};

export default result;
