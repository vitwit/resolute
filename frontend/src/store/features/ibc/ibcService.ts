'use client';

import { TRACK_IBC_TX_TIME_INTERVAL } from '@/utils/constants';
import { SkipRouter, SKIP_API_URL } from '@skip-router/core';
import { AssetsFromSourceRequest } from '@skip-router/core';
import { capitalize } from 'lodash';

declare let window: WalletWindow;

export const txIBCTransfer = async (
  sourceDenom: string,
  sourceChainID: string,
  destChainID: string,
  sourceChain: string,
  destChain: string,
  from: string,
  to: string,
  amount: string,
  onSourceChainTxSuccess: (chainID: string, txHash: string) => void,
  onDestChainTxSuccess: (
    chainID: string,
    txHash: string,
    destChain: string
  ) => void
) => {
  const client = new SkipRouter({
    apiURL: SKIP_API_URL,
    getCosmosSigner: async (chainID) => {
      return window.wallet.getOfflineSigner(chainID);
    },
  });

  const request: AssetsFromSourceRequest = {
    sourceAssetDenom: sourceDenom,
    sourceAssetChainID: sourceChainID,
    includeCW20Assets: false,
    allowMultiTx: true,
  };

  const possibleDestinations = await client.assetsFromSource(request);
  let destinationDenom;
  Object.keys(possibleDestinations).forEach((chainIDItem) => {
    if (chainIDItem === destChainID) {
      destinationDenom = possibleDestinations[chainIDItem][0].denom;
    }
  });

  // no direct ibc path
  if (!destinationDenom) {
    throw new Error(
      `Can\'t find direct a path between ${capitalize(
        sourceChain
      )} to ${capitalize(destChain)}`
    );
  }

  const route = await client.route({
    amountIn: amount,
    sourceAssetChainID: sourceChainID,
    sourceAssetDenom: sourceDenom,
    destAssetChainID: destChainID,
    destAssetDenom: destinationDenom,
    cumulativeAffiliateFeeBPS: '0',
  });

  const addresses: Record<string, string> = {};
  addresses[sourceChainID] = from;
  addresses[destChainID] = to;

  try {
    await client.executeRoute({
      route,
      userAddresses: addresses,
      onTransactionBroadcast: async (txInfo: {
        txHash: string;
        chainID: string;
      }) => {
        // when the transaction is broadcasted on source chain
        onSourceChainTxSuccess(txInfo.chainID, txInfo.txHash);
      },
      onTransactionCompleted: async (chainID: string, txHash: string) => {
        // when the transaction is broadcasted on destination chain
        onDestChainTxSuccess(chainID, txHash, destChain);
      },
    });
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const trackIBCTx = async (
  txHash: string,
  chainID: string,
  onDestChainTxSuccess: (chainID: string, txHash: string) => void
): Promise<void> => {
  const client = new SkipRouter({
    apiURL: SKIP_API_URL,
    getCosmosSigner: async (chainID) => {
      return window.wallet.getOfflineSigner(chainID);
    },
  });

  async function checkTransactionStatus() {
    const result = await client.transactionStatus({
      txHash,
      chainID,
    });
    const txStatus = result.transfers[0].state;
    if (txStatus === 'STATE_COMPLETED_SUCCESS') {
      onDestChainTxSuccess(chainID, txHash);
    } else if (
      txStatus === 'STATE_COMPLETED_ERROR' ||
      txStatus === 'STATE_ABANDONED' ||
      txStatus === 'STATE_UNKNOWN'
    ) {
      /*
        For now, just updating the the transaction as completed as it long as it's not in Pending anymore...
        More comprehensive details can fetched and viewed when showing complete transaction..
      */
      onDestChainTxSuccess(chainID, txHash);
    } else {
      // If the status is not 'success', schedule the next check after 15 seconds
      setTimeout(checkTransactionStatus, TRACK_IBC_TX_TIME_INTERVAL);
    }
  }

  await checkTransactionStatus();
};
