declare let window: WalletWindow;

export async function getWalletAmino(chainID: string): Promise<[any, string]> {
  await window.wallet.enable(chainID);
  const offlineSigner = window.wallet.getOfflineSignerOnlyAmino(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}

export async function getWalletDirect(chainID: string): Promise<[any, string]> {
  await window.wallet.enable(chainID);
  const offlineSigner = window.wallet.getOfflineSigner(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}
