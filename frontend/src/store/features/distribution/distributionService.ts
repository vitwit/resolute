'use client';
import { AxiosResponse } from 'axios';
import { convertPaginationToParams } from '../../../utils/util';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { MAX_TRY_END_POINTS } from '../../../utils/constants';

const delegatorTotalRewardsURL = (address: string) =>
  `/cosmos/distribution/v1beta1/delegators/${address}/rewards`;

export const fetchDelegatorTotalRewards = (
  baseURLs: string[],
  address: string,
  pagination: KeyLimitPagination
): Promise<AxiosResponse> => {
  let endPoint = `${delegatorTotalRewardsURL(address)}`;

  const parsed = convertPaginationToParams(pagination);
  if (parsed !== '') {
    endPoint += `?${parsed}`;
  }

  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const result = {
  delegatorRewards: fetchDelegatorTotalRewards,
};

export default result;
