'use client';

import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

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
      console.log(response)
      if (!response.ok) {
        console.log("hrer.e.re.r")
        if (response.status === 500) {
          console.log("herere..")
          continue;
        } else {
          const res = await response.json();
          throw new Error(res.message || 'Failed to fetch contract');
        }
      }
      return response;
    } catch (error: any) {
      console.log(error)
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

const result = {
  contract: getContract,
};

export default result;
