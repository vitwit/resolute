'use client';

import axios, { AxiosResponse } from 'axios';

const getContractURL = (baseURL: string, address: string) =>
  `${baseURL}/cosmwasm/wasm/v1/contract/${address}`;

const getContractQueryURL = (
  baseURL: string,
  address: string,
  queryData: string
) => `${baseURL}/cosmwasm/wasm/v1/contract/${address}/smart/${queryData}`;

export const getContract = async (
  baseURLs: string[],
  address: string
): Promise<Response> => {
  for (const url of baseURLs) {
    const uri = getContractURL(url, address);
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || 'Failed to fetch contract');
      }
      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  throw new Error('Failed to fetch contract');
};

export const queryContract = async (
  baseURLs: string[],
  address: string,
  queryData: string
): Promise<Response> => {
  for (const url of baseURLs) {
    const uri = getContractQueryURL(url, address, queryData);
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || 'Failed to fetch contract');
      }
      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  throw new Error('Failed to fetch contract');
};

const result = {
  contract: getContract,
};

export default result;
