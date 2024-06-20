'use client';

import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

const getContractURL = (baseURL: string, address: string) =>
  `${baseURL}/cosmwasm/wasm/v1/contract/${address}`;

const codesURL = '/cosmwasm/wasm/v1/code';
const contractsByCodeURL = (codeId: string) =>
  `/cosmwasm/wasm/v1/code/${codeId}/contracts`;

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
      if (response.status === 500) {
        const errorBody = await response.json();
        throw new Error(errorBody?.message || 'Failed to fetch contract', {
          cause: 500,
        });
      } else if (response.ok) {
        return response;
      }
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      if (error.cause === 500) throw new Error(error.message);
      continue;
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
      if (response.status === 500) {
        const errorBody = await response.json();
        throw new Error(errorBody?.message || 'Failed to query contract', {
          cause: 500,
        });
      } else if (response.ok) {
        return response;
      }
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      if (error.cause === 500) throw new Error(error.message);
      continue;
    }
  }
  throw new Error('Failed to query contract');
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const connectWithSigner = async (urls: string[], offlineSigner: any) => {
  for (const url of urls) {
    try {
      const signer = await SigningCosmWasmClient.connectWithSigner(
        url,
        offlineSigner
      );
      return signer;
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.error(`Error connecting to ${url}: ${error.message}`);
    }
  }
  throw new Error('Unable to connect to any RPC URLs');
};

export const getCodes = async (baseURLs: string[]) => {
  return axiosGetRequestWrapper(baseURLs, codesURL);
};

export const getContractsByCode = async (
  baseURLs: string[],
  codeId: string
) => {
  const uri = contractsByCodeURL(codeId);
  return axiosGetRequestWrapper(baseURLs, uri);
};

const result = {
  contract: getContract,
};

export default result;
