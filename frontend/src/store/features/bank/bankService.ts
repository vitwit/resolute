'use client';

import { AxiosResponse } from 'axios';
import { convertPaginationToParams } from '../../../utils/util';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { MAX_TRY_END_POINTS } from '@/utils/constants';

const balancesURL = '/cosmos/bank/v1beta1/balances/';
const balanceURL = (address: string, denom: string) =>
  `/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`;

const fetchBalances = (
  baseURLs: string[],
  address: string,
  pagination?: KeyLimitPagination
): Promise<AxiosResponse> => {
  let resourceEndPoint = `${balancesURL}${address}`;
  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    resourceEndPoint += `?${parsed}`;
  }

  return axiosGetRequestWrapper(baseURLs, resourceEndPoint, MAX_TRY_END_POINTS);
};

const fetchBalance = (
  baseURLs: string[],
  address: string,
  denom: string
): Promise<AxiosResponse> => {
  const resourceEndPoint = `${balanceURL(address, denom)}`;

  return axiosGetRequestWrapper(baseURLs, resourceEndPoint, MAX_TRY_END_POINTS);
};

const result = {
  balances: fetchBalances,
  balance: fetchBalance,
};

export default result;
