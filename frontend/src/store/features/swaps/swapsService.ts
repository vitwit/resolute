import { TxSwapServiceInputs } from '@/types/swaps';
import { SQUID_CLIENT_API, SQUID_ID } from '@/utils/constants';
import { GetRoute, Squid } from '@0xsquid/sdk';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

const squidClient = new Squid();
squidClient.setConfig({
  baseUrl: SQUID_CLIENT_API,
  integratorId: SQUID_ID,
});
squidClient.init();

export const txExecuteSwap = async ({
  route,
  signer,
  signerAddress,
}: TxSwapServiceInputs): Promise<TxRaw> => {
  try {
    const tx = (await squidClient.executeRoute({
      signer: signer,
      route: route,
      signerAddress: signerAddress,
    })) as TxRaw;
    return tx;
  } catch (error) {
    throw error;
  }
};

export const connectWithSigner = async (
  urls: string[],
  offlineSigner: OfflineDirectSigner
) => {
  for (const url of urls) {
    try {
      const signer = await SigningStargateClient.connectWithSigner(
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

export const trackTransactionStatus = async ({
  transactionId,
  fromChainId,
  toChainId,
}: {
  transactionId: string;
  fromChainId: string;
  toChainId: string;
}): Promise<string> => {
  const squid = new Squid();
  squid.setConfig({
    baseUrl: SQUID_CLIENT_API,
    integratorId: SQUID_ID,
  });
  await squid.init();

  let status: string;
  do {
    const response = await squid.getStatus({
      transactionId,
      integratorId: SQUID_ID,
      fromChainId,
      toChainId,
    });
    status = response.squidTransactionStatus || '';
    if (status === 'ongoing') {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  } while (status === 'ongoing');

  return status;
};

export const connectStargateClient = async (urls: string[]) => {
  for (const url of urls) {
    try {
      const client = await SigningStargateClient.connect(url);
      return client;
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.error(`Error connecting to ${url}: ${error.message}`);
    }
  }
  throw new Error('Unable to connect to any RPC URLs');
};

export const fetchSwapRoute = async (params: GetRoute) => {
  try {
    const res = await squidClient.getRoute(params);
    return res;
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (err: any) {
    console.error(err.message);
    throw new Error(err.message);
  }
};
