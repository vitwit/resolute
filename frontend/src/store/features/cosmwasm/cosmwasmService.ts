'use client';

import { MAX_TRY_END_POINTS } from '@/utils/constants';
import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { AxiosResponse } from 'axios';

const getContractURL = (address: string) =>
  `/cosmwasm/wasm/v1/contract/${address}`;

/* eslint-disable @typescript-eslint/no-explicit-any */
const getContract = (
  baseURLs: string[],
  address: string
): Promise<AxiosResponse<any>> => {
  const endPoint = getContractURL(address);
  return axiosGetRequestWrapper(baseURLs, endPoint, MAX_TRY_END_POINTS);
};

const result = {
  contract: getContract,
};

export default result;
