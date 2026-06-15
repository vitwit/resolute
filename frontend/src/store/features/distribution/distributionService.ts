'use client';
import { AxiosResponse } from 'axios';
import {
  addChainIDParam,
  convertPaginationToParams,
} from '../../../utils/util';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';

const delegatorTotalRewardsURL = (address: string) =>
  `/cosmos/distribution/v1beta1/delegators/${address}/rewards`;
const withdrawAddressURL = (delegator: string) =>
  `/cosmos/distribution/v1beta1/delegators/${delegator}/withdraw_address`;

export const fetchDelegatorTotalRewards = (
  baseURLs: string[],
  address: string,
  pagination: KeyLimitPagination,
  chainID: string
): Promise<AxiosResponse> => {
  let endPoint = `${delegatorTotalRewardsURL(address)}`;

  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    endPoint += `?${parsed}`;
  }
  endPoint = addChainIDParam(endPoint, chainID);

  return axiosGetRequestWrapper(baseURLs, endPoint);
};

export const fetchWithdrawAddress = (
  baseURLs: string[],
  delegator: string,
  chainID: string
): Promise<AxiosResponse> => {
  let endPoint = `${withdrawAddressURL(delegator)}`;
  endPoint = addChainIDParam(endPoint, chainID);

  return axiosGetRequestWrapper(baseURLs, endPoint);
};
const result = {
  delegatorRewards: fetchDelegatorTotalRewards,
  withdrawAddress: fetchWithdrawAddress,
};

export default result;
