declare let window: WalletWindow;

export const isWalletInstalled = (walletName: string): boolean => {
  console.log('wallet name in installed', walletName, window.metamask, window.ethereum)
  switch (walletName) {
    case 'keplr':
      if (!window.keplr) return false;
      window.wallet = window.keplr;
      return true;
    case 'leap':
      if (!window.leap) return false;
      window.wallet = window.leap;
      return true;
    case 'cosmostation':
      if (!window.cosmostation?.providers?.keplr) return false;
      window.wallet = window?.cosmostation?.providers?.keplr;
      return true;
    case 'metamask':
      if (!window.ethereum) return false;
      window.wallet = window.ethereum;
      return true;
    default:
      return false;
  }
};
