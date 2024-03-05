'use client';

import { TRACK_IBC_TX_TIME_INTERVAL } from '@/utils/constants';
import { GasPrice } from '@cosmjs/stargate';
import {
  SkipRouter,
  SKIP_API_URL,
  AssetsBetweenChainsRequest,
} from '@skip-router/core';
import { AssetsFromSourceRequest } from '@skip-router/core';
import { capitalize } from 'lodash';

declare let window: WalletWindow;

function createSkipRouterClient() {
  return new SkipRouter({
    apiURL: SKIP_API_URL,
    getCosmosSigner: async (chainID) => {
      return window.wallet.getOfflineSigner(chainID);
    },
  });
}

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
  ) => void,
  getFee: (chainID: string) => Promise<GasPrice | undefined>
) => {
  const client = createSkipRouterClient();

  // const request: AssetsFromSourceRequest = {
  //   sourceAssetDenom: sourceDenom,
  //   sourceAssetChainID: sourceChainID,
  //   includeCW20Assets: false,
  //   allowMultiTx: true,
  //   includeSwaps: true,
  // };

  const request: AssetsBetweenChainsRequest = {
    destChainID: 'dymension_1100-1',
    sourceChainID: 'akashnet-2',
    allowMultiTx: true,
  };

  console.log('================');
  console.log(client);

  const possibleDestinations = await client.assetsBetweenChains(request);
  console.log('=============');
  console.log(possibleDestinations);
  // let destinationDenom;
  // Object.keys(possibleDestinations).forEach((chainIDItem) => {
  //   if (chainIDItem === destChainID) {
  //     destinationDenom = possibleDestinations?.[chainIDItem]?.[0]?.denom;
  //   }
  // });

  // // no direct ibc path
  // if (!destinationDenom) {
  //   throw new Error(
  //     `Can\'t find direct a path between ${capitalize(
  //       sourceChain
  //     )} to ${capitalize(destChain)}`
  //   );
  // }

  const route = await client.route({
    amountIn: '1000',
    sourceAssetChainID: 'akashnet-2',
    sourceAssetDenom: 'uakt',
    destAssetChainID: 'dymension_1100-1',
    destAssetDenom: 'adym',
    cumulativeAffiliateFeeBPS: '0',
    allowUnsafe: true,
    experimentalFeatures: ['cctp'],
    clientID: '',
    allowMultiTx: true,
  });

  console.log('-=======');
  console.log(route);

  const addresses: Record<string, string> = {};
  ``;
  // for all intermediary stops
  for (const chainID of route.chainIDs) {
    const account = await window.wallet.getKey(chainID);
    addresses[chainID] = account.bech32Address;
  }

  // for destination
  addresses[destChainID] = 'dym17ledzkcr3kr7u78ptv3ex53rmgx2mpuwtuynjv';

  try {
    await client.executeRoute({
      route,
      userAddresses: addresses,
      getGasPrice: getFee,
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
    console.log('-----');
    console.log(err);
    throw err;
  }
};

export const trackIBCTx = async (
  txHash: string,
  chainID: string,
  onDestChainTxSuccess: (chainID: string, txHash: string) => void
): Promise<void> => {
  const client = createSkipRouterClient();

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
