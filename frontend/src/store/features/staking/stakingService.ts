import Axios, { AxiosResponse } from 'axios';
import { convertPaginationToParams, cleanURL } from '../../../utils/util';
import {
  GetDelegationsResponse,
  GetParamsResponse,
  GetUnbondingResponse,
  GetValidatorsResponse,
} from '../../../types/staking';
/* disable eslint*/
const validatorsURL = '/cosmos/staking/v1beta1/validators';
const delegationsURL = '/cosmos/staking/v1beta1/delegations/';
const unbondingDelegationsURL = (address: string) =>
  `/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`;
const paramsURL = '/cosmos/staking/v1beta1/params';

const fetchValidators = (
  baseURL: string,
  status?: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse<GetValidatorsResponse>> => {
  let uri = `${cleanURL(baseURL)}${validatorsURL}`;

  const pageParams = convertPaginationToParams(pagination);
  if (status) {
    uri += `?status=${status}`;
    if (pageParams) uri += `&${pageParams}`;
  } else {
    if (pageParams) uri += `?${pageParams}`;
  }

  return Axios.get(uri);
};

const fetchdelegations = (
  baseURL: string,
  address: string,
  pagination: KeyLimitPagination
): Promise<AxiosResponse<GetDelegationsResponse>> => {
  let uri = `${cleanURL(baseURL)}${delegationsURL}${address}`;
  const pageParams = convertPaginationToParams(pagination);
  if (pageParams !== '') uri += `?${pageParams}`;

  return Axios.get(uri);
};

const fetchUnbonding = async (
  baseURL: string,
  address: string
): Promise<AxiosResponse<GetUnbondingResponse>> => {
  const uri = `${baseURL}${unbondingDelegationsURL(address)}`;

  return Axios.get(uri);
};

const fetchParams = (
  baseURL: string
): Promise<AxiosResponse<GetParamsResponse>> =>
  Axios.get(`${cleanURL(baseURL)}${paramsURL}`);

const result = {
  validators: fetchValidators,
  delegations: fetchdelegations,
  unbonding: fetchUnbonding,
  params: fetchParams,
};

export default result;
