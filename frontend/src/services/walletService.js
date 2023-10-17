export const connectWalletV1 = async (data) => {
  const mainnets = data.mainnets;
  const testnets = data.testnets;
  console.log("connect wallet called...");
  if (!window.keplr) {
    alert("keplr not connected");
    return;
  } else {
    window.wallet = window.keplr;
    window.wallet.defaultOptions = {
      sign: {
        preferNoSetMemo: true,
        disableBalanceCheck: true,
      },
    };

    let walletName = "";
    let isNanoLedger = false;
    const chainInfos = {};
    const nameToChainIDs = {};
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
        let chainId = mainnets[i].config.chainId;
        const chainName = mainnets[i].config.chainName;
        await getWalletAmino(chainId);
        let walletInfo = await window.wallet.getKey(chainId);
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
        const chainId = testnets[i].config.chainId;
        const chainName = testnets[i].config.chainName;
        await getWalletAmino(chainId);
        const walletInfo = await window.wallet.getKey(chainId);
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

    if (chainInfos.length === 0) {
      alert("Permission denied for all the networks");
    }
    
    data.setIsConnected(true);
  }
};

export async function getWalletAmino(chainID) {
  await window.wallet.enable(chainID);
  const offlineSigner = window.wallet.getOfflineSignerOnlyAmino(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}

export async function getWalletDirect(chainID) {
  await window.wallet.enable(chainID);
  const offlineSigner = window.wallet.getOfflineSigner(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts[0]];
}
