'use client';
import Axios, { AxiosResponse } from 'axios';
import { convertPaginationToParams, cleanURL } from '../../../utils/util';

const delegatorTotalRewardsURL = (address: string) =>
  `/cosmos/distribution/v1beta1/delegators/${address}/rewards`;

export const fetchDelegatorTotalRewards = (
  baseURL: string,
  address: string,
  pagination: KeyLimitPagination
): Promise<AxiosResponse> => {
  let uri = `${cleanURL(baseURL)}${delegatorTotalRewardsURL(address)}`;
  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    uri += `?${parsed}`;
  }

  return Axios.get(uri);
};

const result = {
  delegatorRewards: fetchDelegatorTotalRewards,
};

export default result;
