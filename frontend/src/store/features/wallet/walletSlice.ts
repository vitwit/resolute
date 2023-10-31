"use client"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getWalletAmino } from "../../../txns/execute";
import { isWalletInstalled } from "./walletService";
import { isConnected, setConnected, setWalletName } from "../../../utils/localStorage";

declare let window: WalletWindow;

interface ChainInfo {
  walletInfo: {
    name: string;
    isNanoLedger: boolean;
    pubKey: string;
  };
  network: {
    config: {
      chainId: string;
      chainName: string;
    };
    keplrExperimental?: boolean;
    leapExperimental?: boolean;
  };
}

const initialState = {
  name: "",
  connected: false,
  isNanoLedger: false,
  pubKey: "",
  networks: {},
  nameToChainIDs: {},
};

export const connectWalletV1 = createAsyncThunk(
  "wallet/connectv1",
  async (
    data: {
      mainnets: Network[];
      testnets: Network[];
      walletName: string;
    },
    { rejectWithValue, fulfillWithValue }
  ) => {
    const mainnets = data.mainnets;
    const testnets = data.testnets;

    if (!isWalletInstalled(data.walletName)) {
      alert("wallet is not installed");
      return rejectWithValue("wallet is not installed");
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

      let walletName = "";
      let isNanoLedger = false;
      const chainInfos: Record<string, ChainInfo> = {};
      const nameToChainIDs: Record<string, string> = {};
      for (let i = 0; i < mainnets.length; i++) {
        try {
          if (
            (data.walletName === "keplr" ||
              data.walletName === "cosmostation") &&
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
          let walletInfo = await window.wallet.getKey(chainId);
          walletInfo.pubKey = Buffer.from(walletInfo?.pubKey).toString(
            "base64"
          );
          delete walletInfo?.address;

          walletName = walletInfo?.name;
          isNanoLedger = walletInfo?.isNanoLedger || false;

          chainInfos[chainId] = {
            walletInfo: walletInfo,
            network: mainnets[i],
          };
          nameToChainIDs[chainName?.toLowerCase().split(" ").join("")] =
            chainId;
        } catch (error) {
          console.log(
            `unable to connect to network ${mainnets[i].config.chainName}: `,
            error
          );
        }
      }

      for (let i = 0; i < testnets.length; i++) {
        try {
          if (
            (data.walletName === "keplr" ||
              data.walletName === "cosmostation") &&
            testnets[i].keplrExperimental
          ) {
            await window.wallet.experimentalSuggestChain(mainnets[i].config);
          }
          if (data.walletName === "leap" && testnets[i].leapExperimental) {
            await window.wallet.experimentalSuggestChain(mainnets[i].config);
          }
          const chainId = testnets[i].config.chainId;
          const chainName = testnets[i].config.chainName;
          await getWalletAmino(chainId);
          const walletInfo = await window.wallet.getKey(chainId);
          walletInfo.pubKey = Buffer.from(walletInfo?.pubKey).toString(
            "base64"
          );
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
        return rejectWithValue("Permission denied for all the networks");
      } else {
        setConnected();
        setWalletName(data.walletName);
        return fulfillWithValue({
          chainInfos,
          nameToChainIDs,
          walletName,
          isNanoLedger,
        });
      }
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (
      state,
      action: PayloadAction<{ address: string; chainInfo: any }>
    ) => {
      state.connected = true;
    },
    resetWallet: (state) => {
      state.connected = false;

      state.name = "";
      state.pubKey = "";
      state.nameToChainIDs = {};
      state.networks = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWalletV1.pending, () => {})
      .addCase(connectWalletV1.fulfilled, (state, action) => {
        const networks = action.payload.chainInfos;
        const nameToChainIDs = action.payload.nameToChainIDs;
        state.networks = networks;
        state.nameToChainIDs = nameToChainIDs;
        state.connected = true;
        state.isNanoLedger = action.payload.isNanoLedger;
        state.name = action.payload.walletName;
      })
      .addCase(connectWalletV1.rejected, () => {});
  },
});

export const { setWallet, resetWallet } = walletSlice.actions;

export default walletSlice.reducer;
