export const KEY_WALLET_NAME: string = 'WALLET_NAME';
export const KEY_DARK_MODE: string = 'DARK_MODE';
const AUTH_TOKEN_KEY_NAME: string = 'AUTH_TOKEN';
const AUTHZ_KEY = 'Authz_key';
const AUTHZ_VALUE = 'Authz_value';
const FEEGRANT_KEY = 'feegrant_key';
const FEEGRANT_VALUE = 'feegrant_value';
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

export const isMetaMaskWallet = () =>
  localStorage.getItem(KEY_WALLET_NAME) === 'metamask';

export function isConnected(): boolean {
  const connected = localStorage.getItem('CONNECTED');
  if (connected && KEY_WALLET_NAME) {
    return true;
  }

  return false;
}
export function logout() {
  localStorage.removeItem('CONNECTED');
  removeAllAuthTokens();
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

  try {
    if (tokens) {
      authTokens = JSON.parse(tokens);
    }

    const token = authTokens.filter((item: AuthToken) => {
      return item.chainID === authToken.chainID;
    });

    if (token.length) {
      return;
    }
  } catch (e) {
    console.log(e);
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
  try {
    const tokens = localStorage.getItem(AUTH_TOKEN_KEY_NAME);

    if (tokens) {
      const authTokens = JSON.parse(tokens);

      const token = authTokens.filter((item: AuthToken) => {
        return item.chainID === chainID;
      });
      return token[0];
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}

export function removeAllAuthTokens() {
  localStorage.removeItem(AUTH_TOKEN_KEY_NAME);
}

export function checkAuthzKeyAddress(address: string): boolean {
  return localStorage.getItem(AUTHZ_KEY) === address;
}

export function checkFeegrantKeyAddress(address: string): boolean {
  return localStorage.getItem(FEEGRANT_KEY) === address;
}

export function getAuthzValueAddress(): string {
  return localStorage.getItem(AUTHZ_VALUE) || '';
}

export function getFeegrantValueAddress(): string {
  return localStorage.getItem(FEEGRANT_VALUE) || '';
}

export function logoutAuthzMode() {
  localStorage.removeItem(AUTHZ_KEY);
  localStorage.removeItem(AUTHZ_VALUE);
}

export function logoutFeegrantMode() {
  localStorage.removeItem(FEEGRANT_KEY);
  localStorage.removeItem(FEEGRANT_VALUE);
}

export function getAuthzMode(address: string): {
  isAuthzModeOn: boolean;
  authzAddress: string;
} {
  if (!checkAuthzKeyAddress(address)) {
    logoutAuthzMode();
    return {
      isAuthzModeOn: false,
      authzAddress: '',
    };
  }
  return {
    isAuthzModeOn: true,
    authzAddress: getAuthzValueAddress(),
  };
}

export function getFeegrantMode(address: string): {
  isFeegrantModeOn: boolean;
  feegrantAddress: string;
} {
  if (!checkFeegrantKeyAddress(address)) {
    logoutFeegrantMode();
    return {
      isFeegrantModeOn: false,
      feegrantAddress: '',
    };
  }
  return {
    isFeegrantModeOn: true,
    feegrantAddress: getFeegrantValueAddress(),
  };
}

export function setAuthzMode(address: string, authzAddress: string) {
  localStorage.setItem(AUTHZ_KEY, address);
  localStorage.setItem(AUTHZ_VALUE, authzAddress);
}

export function setFeegrantMode(address: string, feegrantAddress: string) {
  localStorage.setItem(FEEGRANT_KEY, address);
  localStorage.setItem(FEEGRANT_VALUE, feegrantAddress);
}
