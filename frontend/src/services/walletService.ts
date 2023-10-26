import { setConnected, setWalletName } from "staking/utils/localStorage";

export const isWalletInstalled = (walletName: string): boolean => {
  switch (walletName) {
    case "keplr":
      if (!window.keplr) return false;
      window.wallet = window.keplr;
      setConnected();
      setWalletName(walletName);
      return true;
    case "leap":
      if (!window.leap) return false;
      window.wallet = window.leap;
      setConnected();
      setWalletName(walletName);
      return true;
    case "cosmostation":
      if (!window.cosmostation?.providers?.keplr) return false;
      window.wallet = window?.cosmostation?.providers?.keplr;
      setConnected();
      setWalletName(walletName);
      return true;
    default:
      return false;
  }
};

export const connectWalletV1 = async (data: {
  walletName: string;
  mainnets: any[];
  testnets: any[];
  setConnected: (connected: boolean) => void;
}): Promise<void> => {
  const walletName: string = data.walletName;
  const mainnets: Network[] = data.mainnets;
  const testnets: Network[] = data.testnets;

  if (!isWalletInstalled(walletName)) {
    alert("wallet is not connected");
    return;
  } else {
    window.wallet.defaultOptions = {
      sign: {
        preferNoSetMemo: true,
        disableBalanceCheck: true,
      },
    };
    const mainnetChainIDs: string[] = mainnets.map(
      (mainnet) => mainnet.config.chainId
    );
    const testnetChainIDs: string[] = testnets.map(
      (testnet) => testnet.config.chainId
    );
    const chainIDs: string[] = [...mainnetChainIDs, ...testnetChainIDs];
    window.wallet.enable(chainIDs);
    let walletName: string = "";
    let isNanoLedger: boolean = false;
    const chainInfos: { [key: string]: any } = {};
    const nameToChainIDs: { [key: string]: string } = {};
    for (let i = 0; i < mainnets.length; i++) {
      try {
        if (
          (data.walletName === "keplr" || data.walletName === "cosmostation") &&
          mainnets[i].keplrExperimental
        ) {
          await window.wallet.experimentalSuggestChain(mainnets[i].config);
        }
        if (data.walletName === "leap" && mainnets[i].leapExperimental) {
          await window.wallet.experimentalSuggestChain(mainnets[i].config);
        }
        let chainId: string = mainnets[i].config.chainId;
        const chainName: string = mainnets[i].config.chainName;
        await getWalletAmino(chainId);
        let walletInfo: any = await window.wallet.getKey(chainId);
        walletInfo.pubKey = Buffer.from(walletInfo?.pubKey).toString("base64");
        delete walletInfo?.address;

        walletName = walletInfo?.name;
        isNanoLedger = walletInfo?.isNanoLedger || false;

        chainInfos[chainId] = {
          walletInfo: walletInfo,
          network: mainnets[i],
        };
        nameToChainIDs[chainName?.toLowerCase().split(" ").join("")] = chainId;
      } catch (error) {
        console.log(
          `unable to connect to network ${mainnets[i].config.chainName}: `,
          error
        );
      }
    }

    for (let i = 0; i < testnets.length; i++) {
      try {
        if (testnets[i].experimental) {
          await window.wallet.experimentalSuggestChain(testnets[i].config);
        }
        const chainId: string = testnets[i].config.chainId;
        const chainName: string = testnets[i].config.chainName;
        await getWalletAmino(chainId);
        const walletInfo: any = await window.wallet.getKey(chainId);
        walletInfo.pubKey = Buffer.from(walletInfo?.pubKey).toString("base64");
        delete walletInfo?.address;

        walletName = walletInfo?.name;
        isNanoLedger = walletInfo?.isNanoLedger || false;

        chainInfos[chainId] = {
          walletInfo: walletInfo,
          network: testnets[i],
        };

        nameToChainIDs[chainName?.toLowerCase()] = chainId;
      } catch (error) {
        console.log(
          `unable to connect to network ${mainnets[i].config.chainName}: `,
          error
        );
      }
    }

    if (Object.keys(chainInfos).length === 0) {
      alert("Permission denied for all the networks");
    }
    //this is for the state in the page
    data.setConnected(true);
  }
};

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
