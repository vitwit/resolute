import { TxSwapServiceInputs } from '@/types/swaps';
import { SkipRouter, SKIP_API_URL } from '@skip-router/core';

declare let window: WalletWindow;

export function createSkipRouterClient() {
  return new SkipRouter({
    apiURL: SKIP_API_URL,
    getCosmosSigner: async (chainID) => {
      return window.wallet.getOfflineSigner(chainID);
    },
  });
}

export const txSwap = async ({
  route,
  userAddresses,
  onDestChainTxSuccess,
  onSourceChainTxSuccess,
}: TxSwapServiceInputs) => {
  const client = createSkipRouterClient();

  try {
    await client.executeRoute({
      route,
      userAddresses,
      onTransactionBroadcast: async (txInfo: {
        txHash: string;
        chainID: string;
      }) => {
        // when the transaction is broadcasted on source chain
        onSourceChainTxSuccess(txInfo.chainID, txInfo.txHash);
      },
      onTransactionCompleted: async (chainID: string, txHash: string) => {
        // when the transaction is broadcasted on destination chain
        onDestChainTxSuccess(chainID, txHash);
      },
    });
  } catch (error) {
    throw error
  }
};
