declare let window: WalletWindow;

export const isWalletInstalled = (walletName: string): boolean => {
  switch (walletName) {
    case "keplr":
      if (!window.keplr) return false;
      window.wallet = window.keplr;
      return true;
    case "leap":
      if (!window.leap) return false;
      window.wallet = window.leap;
      return true;
    case "cosmostation":
      if (!window.cosmostation?.providers?.keplr) return false;
      window.wallet = window?.cosmostation?.providers?.keplr;
      return true;
    default:
      return false;
  }
};
