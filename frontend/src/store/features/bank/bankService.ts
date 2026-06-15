'use client';

import { AxiosResponse } from 'axios';
import {
  addChainIDParam,
  convertPaginationToParams,
} from '../../../utils/util';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';

const balancesURL = '/cosmos/bank/v1beta1/balances/';
const balanceURL = (address: string, denom: string) =>
  `/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`;

const fetchBalances = (
  baseURLs: string[],
  address: string,
  chainID: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse> => {
  let resourceEndPoint = `${balancesURL}${address}`;
  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    resourceEndPoint += `?${parsed}`;
  }
  resourceEndPoint = addChainIDParam(resourceEndPoint, chainID);

  return axiosGetRequestWrapper(baseURLs, resourceEndPoint);
};

const fetchBalance = (
  baseURLs: string[],
  address: string,
  denom: string,
  chainID: string
): Promise<AxiosResponse> => {
  let resourceEndPoint = `${balanceURL(address, denom)}`;
  resourceEndPoint = addChainIDParam(resourceEndPoint, chainID);

  return axiosGetRequestWrapper(baseURLs, resourceEndPoint);
};

const result = {
  balances: fetchBalances,
  balance: fetchBalance,
};

export default result;
