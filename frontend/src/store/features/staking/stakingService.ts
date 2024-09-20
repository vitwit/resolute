'use client';

import { AxiosResponse } from 'axios';
import {
  addChainIDParam,
  convertPaginationToParams,
} from '../../../utils/util';
import {
  GetDelegationsResponse,
  GetParamsResponse,
  GetUnbondingResponse,
  GetValidatorsResponse,
  Validator,
} from '../../../types/staking';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
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
  chainID: string,
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
  endPoint = addChainIDParam(endPoint, chainID);

  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const fetchdelegations = (
  baseURLs: string[],
  address: string,
  chainID: string,
  pagination: KeyLimitPagination
): Promise<AxiosResponse<GetDelegationsResponse>> => {
  let endPoint = `${delegationsURL}${address}`;
  const pageParams = convertPaginationToParams(pagination);
  if (pageParams !== '') {
    endPoint += `?${pageParams}`;
  }
  endPoint = addChainIDParam(endPoint, chainID);

  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const fetchUnbonding = async (
  baseURLs: string[],
  address: string,
  chainID: string
): Promise<AxiosResponse<GetUnbondingResponse>> => {
  let endPoint = `${unbondingDelegationsURL(address)}`;
  endPoint = addChainIDParam(endPoint, chainID);

  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const fetchParams = (
  baseURLs: string[],
  chainID: string
): Promise<AxiosResponse<GetParamsResponse>> => {
  const endPoint = addChainIDParam(paramsURL, chainID);
  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const fetchPoolInfo = (
  baseURLs: string[],
  chainID: string
): Promise<AxiosResponse> => {
  const endPoint = addChainIDParam(poolURL, chainID);
  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const fetchValidator = (
  baseURLs: string[],
  address: string,
  chainID: string
): Promise<AxiosResponse<{ validator: Validator }>> => {
  let endPoint = validatorURL(address);
  endPoint = addChainIDParam(endPoint, chainID);
  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const fetchValidatorDelegations = async (
  baseURLs: string[],
  operatorAddress: string,
  chainID: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> => {
  let endPoint = `${validatorDelegationsURL(operatorAddress)}`;
  endPoint = addChainIDParam(endPoint, chainID);

  return axiosGetRequestWrapper(baseURLs, endPoint);
};

const fetchPolygonValidator = async (
  baseURL: string,
  id: number
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> => {
  const endPoint = `${polygonValidatorURL(id)}`;

  return axiosGetRequestWrapper([baseURL], endPoint);
};

const fetchPolygonDelegators = async (
  baseURL: string,
  id: number
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> => {
  const endPoint = `${polygonDelegatorsURL(id)}`;

  return axiosGetRequestWrapper([baseURL], endPoint);
};

const fetchOasisDelegations = async (
  baseURL: string,
  operatorAddress: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
): Promise<AxiosResponse<any>> => {
  const endPoint = `${oasisDelegationsURL(operatorAddress)}`;

  return axiosGetRequestWrapper([baseURL], endPoint);
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
