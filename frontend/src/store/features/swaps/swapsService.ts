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
