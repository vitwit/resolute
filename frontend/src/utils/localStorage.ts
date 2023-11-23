export const KEY_WALLET_NAME: string = 'WALLET_NAME';
export const KEY_DARK_MODE: string = 'DARK_MODE';

export function setConnected() {
  localStorage.setItem('CONNECTED', 'true');
}

export function setWalletName(walletName: string) {
  localStorage.setItem(KEY_WALLET_NAME, walletName);
}

export function getWalletName(): string {
  return localStorage.getItem(KEY_WALLET_NAME) || '';
}

export function removeWalletName() {
  localStorage.removeItem(KEY_WALLET_NAME);
}

export function isConnected(): boolean {
  const connected = localStorage.getItem('CONNECTED');
  if (connected && KEY_WALLET_NAME) {
    return true;
  }

  return false;
}
export function logout() {
  localStorage.removeItem('CONNECTED');
  removeWalletName();
}

export function getMainnets(): Network[] {
  const networksInfo = localStorage.getItem('networks');
  if (networksInfo) {
    const networks = JSON.parse(networksInfo);
    if (networks?.mainnets) {
      return networks?.mainnets;
    }
  }
  return [];
}

export function getTransactions(
  chainID: string,
  address: string
): Transaction[] {
  const key = address + ' ' + chainID;
  const transactions = localStorage.getItem(key);
  if (transactions) return JSON.parse(transactions);
  return [];
}

export function addTransanctions(
  chainID: string,
  address: string,
  transactions: Transaction[]
) {
  let storedTransactions = getTransactions(chainID, address);
  storedTransactions = [...storedTransactions, ...transactions];
  const key = address + ' ' + chainID;
  localStorage.set(key, JSON.stringify(storedTransactions));
}
