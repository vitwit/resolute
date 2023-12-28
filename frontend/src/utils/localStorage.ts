export const KEY_WALLET_NAME: string = 'WALLET_NAME';
export const KEY_DARK_MODE: string = 'DARK_MODE';
const AUTH_TOKEN_KEY_NAME: string = 'AUTH_TOKEN';
const KEY_TRANSACTIONS = (address: string) => 'transactions' + ' ' + address;

interface LocalNetworks {
  [key: string]: Network;
}

interface AuthToken {
  chainID: string;
  address: string;
  signature: string;
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
  // if accessed on server side
  if (typeof window == 'undefined') return false;
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

export function addTransactions(transactions: Transaction[], address: string) {
  const key = KEY_TRANSACTIONS(address);
  let storedTransactions = getTransactions(address);
  storedTransactions = [...transactions, ...storedTransactions];
  localStorage.setItem(key, JSON.stringify(storedTransactions));
}

export function updateIBCStatus(address: string, txHash: string) {
  const txns = getTransactions(address);
  let updateNeeded = false;
  const updatedTxns = txns.map((tx) => {
    if (tx.transactionHash === txHash) {
      updateNeeded = true;
      return { ...tx, isIBCPending: false };
    }
    return tx;
  });

  if (updateNeeded) {
    const key = KEY_TRANSACTIONS(address);
    localStorage.setItem(key, JSON.stringify(updatedTxns));
  }
}

export function setAuthToken(authToken: AuthToken) {
  const tokens = localStorage.getItem(AUTH_TOKEN_KEY_NAME);
  let authTokens = [];

  if (tokens) {
    authTokens = JSON.parse(tokens);
  }

  const token = authTokens.filter((item: AuthToken) => {
    return item.chainID === authToken.chainID;
  });

  if (token.length) {
    return;
  }
  if (authToken.chainID && authToken.address && authToken.signature) {
    authTokens.push({
      chainID: authToken.chainID,
      address: authToken.address,
      signature: authToken.signature,
    });
    localStorage.setItem(AUTH_TOKEN_KEY_NAME, JSON.stringify(authTokens));
  }
}

export function getAuthToken(chainID: string): AuthToken | null {
  const tokens = localStorage.getItem(AUTH_TOKEN_KEY_NAME);

  if (tokens) {
    const authTokens = JSON.parse(tokens);

    const token = authTokens.filter((item: AuthToken) => {
      return item.chainID === chainID;
    });
    return token[0];
  }

  return null;
}

export function removeAllAuthTokens() {
  localStorage.removeItem(AUTH_TOKEN_KEY_NAME);
}
