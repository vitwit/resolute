'use client';

import { AxiosResponse } from 'axios';
import { convertPaginationToParams } from '../../../utils/util';
import {
  GetDelegationsResponse,
  GetParamsResponse,
  GetUnbondingResponse,
  GetValidatorsResponse,
  Validator,
} from '../../../types/staking';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { MAX_TRY_END_POINTS } from '@/utils/constants';
const validatorsURL = '/cosmos/staking/v1beta1/validators';
const delegationsURL = '/cosmos/staking/v1beta1/delegations/';
const unbondingDelegationsURL = (address: string) =>
  `/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`;
const validatorDelegationsURL = (operatorAddress: string) =>
  `/cosmos/staking/v1beta1/validators/${operatorAddress}/delegations?pagination.count_total=1`;
const validatorURL = (address: string) =>
  `/cosmos/staking/v1beta1/validators/${address}`;
const paramsURL = '/cosmos/staking/v1beta1/params';
const poolURL = '/cosmos/staking/v1beta1/pool';

const polygonValidatorURL = (id: number) => `/validators/${id}`;
const polygonDelegatorsURL = (id: number) => `/validators/${id}/delegators`;
const oasisDelegationsURL = (operatorAddress: string) =>
  `/mainnet/validator/delegators?address=${operatorAddress}&page=1&size=20`;

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

const fetchValidator = (
  baseURLs: string[],
  address: string
): Promise<AxiosResponse<{ validator: Validator }>> => {
  return axiosGetRequestWrapper(
    baseURLs,
    validatorURL(address),
    MAX_TRY_END_POINTS
  );
};

const fetchValidatorDelegations = async (
  baseURLs: string[],
  operatorAddress: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> => {
  const endPoint = `${validatorDelegationsURL(operatorAddress)}`;

  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const fetchPolygonValidator = async (
  baseURL: string,
  id: number
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> => {
  const endPoint = `${polygonValidatorURL(id)}`;

  return axiosGetRequestWrapper([baseURL], endPoint, MAX_TRY_END_POINTS);
};

const fetchPolygonDelegators = async (
  baseURL: string,
  id: number
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> => {
  const endPoint = `${polygonDelegatorsURL(id)}`;

  return axiosGetRequestWrapper([baseURL], endPoint, MAX_TRY_END_POINTS);
};

const fetchOasisDelegations = async (
  baseURL: string,
  operatorAddress: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> => {
  const endPoint = `${oasisDelegationsURL(operatorAddress)}`;

  return axiosGetRequestWrapper([baseURL], endPoint, MAX_TRY_END_POINTS);
};

const result = {
  validators: fetchValidators,
  delegations: fetchdelegations,
  unbonding: fetchUnbonding,
  params: fetchParams,
  poolInfo: fetchPoolInfo,
  validatorInfo: fetchValidator,
  validatorDelegations: fetchValidatorDelegations,
  polygonValidator: fetchPolygonValidator,
  polygonDelegators: fetchPolygonDelegators,
  oasisDelegations: fetchOasisDelegations,
};

export default result;
