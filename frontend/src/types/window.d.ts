import { KeplrWindow } from '@keplr-wallet/types';
declare global {
  interface WalletWindow extends Window {
    keplr: KeplrWindow;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    leap: any;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    wallet: KeplrWindow | any;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    cosmostation: any;
    getOfflineSigner: any;
  }
}
