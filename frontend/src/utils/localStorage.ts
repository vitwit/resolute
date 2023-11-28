export const KEY_WALLET_NAME: string = 'WALLET_NAME';
export const KEY_DARK_MODE: string = 'DARK_MODE';
const KEY_TRANSACTIONS = (address: string) => 'transactions' + ' ' + address;

interface LocalNetworks {
  [key: string]: Network;
}

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

export function setLocalNetwork(networkConfig: Network, chainID: string) {
  const localNetworks = localStorage.getItem('localNetworks');
  let localNetworksParsed: LocalNetworks = {};
  if (localNetworks) {
    localNetworksParsed = JSON.parse(localNetworks);
  }
  localNetworksParsed[chainID] = networkConfig;
  localStorage.setItem('localNetworks', JSON.stringify(localNetworksParsed));
}

export function getLocalNetworks(): Network[] {
  const localNetworks = localStorage.getItem('localNetworks');
  const networks: Network[] = [];
  if (localNetworks) {
    const localNetworksParsed = JSON.parse(localNetworks);
    Object.keys(localNetworksParsed).forEach((chainID) => {
      networks.push(localNetworksParsed[chainID]);
    });
  }
  return networks;
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

export function getTransactions(address: string): Transaction[] {
  const transactions = localStorage.getItem(KEY_TRANSACTIONS(address));
  if (transactions) return JSON.parse(transactions);
  return [];
}

export function addTransanctions(transactions: Transaction[], address: string) {
  const key = KEY_TRANSACTIONS(address);
  let storedTransactions = getTransactions(address);
  storedTransactions = [...transactions, ...storedTransactions];
  localStorage.setItem(key, JSON.stringify(storedTransactions));
}
