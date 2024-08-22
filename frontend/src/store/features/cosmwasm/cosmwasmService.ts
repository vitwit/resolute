'use client';

import { axiosGetRequestWrapper } from '@/utils/RequestWrapper';
import { addChainIDParam } from '@/utils/util';
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
  address: string,
  chainID: string
): Promise<Response> => {
  for (const url of baseURLs) {
    let uri = getContractURL(url, address);
    uri = addChainIDParam(uri, chainID);
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
  queryData: string,
  chainID: string
): Promise<Response> => {
  for (const url of baseURLs) {
    let requestURI = getContractQueryURL(url, address, queryData);
    requestURI = addChainIDParam(requestURI, chainID);
    try {
      const response = await fetch(requestURI);
      const responseJson = await response.json();
      if (response.status === 500) {
        throw new Error(responseJson?.message || 'Failed to query contract', {
          cause: 500,
        });
      } else if (
        response.status === 400 &&
        responseJson?.error.includes('expected')
      ) {
        throw new Error(responseJson?.error || 'Failed to query contract', {
          cause: 500,
        });
      } else if (response.ok) {
        return responseJson;
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

export const getCodes = async (baseURLs: string[], chainID: string) => {
  const requestURI = addChainIDParam(codesURL, chainID);
  return axiosGetRequestWrapper(baseURLs, requestURI);
};

export const getContractsByCode = async (
  baseURLs: string[],
  codeId: string,
  chainID: string
) => {
  let requestURI = contractsByCodeURL(codeId);
  requestURI = addChainIDParam(requestURI, chainID);

  return axiosGetRequestWrapper(baseURLs, requestURI);
};

const result = {
  contract: getContract,
};

export default result;
