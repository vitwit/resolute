import { toBase64 } from "@cosmjs/encoding";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getKeplrWalletAmino, isKeplrInstalled } from "../../txns/execute";
import { setConnected } from "../../utils/localStorage";
import { setError } from "../common/commonSlice";

const initialState = {
  name: "",
  connected: false,
  isNanoLedger: false,
  networks: {},
  nameToChainIDs: {},
};

export const connectKeplrWalletV1 = createAsyncThunk(
  "wallet/connectv1",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    const mainnets = data.mainnets;
    const testnets = data.testnets;

    if (!isKeplrInstalled()) {
      dispatch(
        setError({
          type: "error",
          message: "Keplr wallet is not installed",
        })
      );
      return rejectWithValue("Keplr wallet is not installed");
    } else {
      window.keplr.defaultOptions = {
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
          if (mainnets[i].experimental) {
            await window.keplr.experimentalSuggestChain(mainnets[i].config);
          }
          let chainId = mainnets[i].config.chainId;
          const chainName = mainnets[i].config.chainName;
          await getKeplrWalletAmino(chainId);
          let walletInfo = await window.keplr.getKey(chainId);
          delete walletInfo?.pubKey;
          delete walletInfo?.address;

          walletName = walletInfo?.name;
          isNanoLedger = walletInfo?.isNanoLedger || false;


          chainInfos[chainId] = {
            walletInfo: walletInfo,
            network: mainnets[i],
          };
          nameToChainIDs[chainName?.toLowerCase().split(" ").join("")] = chainId;
        } catch (error) {
          console.log("unable to connect: ", error);
        }
      }

      for (let i = 0; i < testnets.length; i++) {
        try {
          if (testnets[i].experimental) {
            await window.keplr.experimentalSuggestChain(testnets[i].config);
          }
          const chainId = testnets[i].config.chainId;
          const chainName = testnets[i].config.chainName;
          await getKeplrWalletAmino(chainId);
          const walletInfo = await window.keplr.getKey(chainId);
          delete walletInfo?.pubKey;
          delete walletInfo?.address;

          walletName = walletInfo?.name;
          isNanoLedger = walletInfo?.isNanoLedger || false;

          chainInfos[chainId] = {
            walletInfo: walletInfo,
            network: testnets[i],
          };

          nameToChainIDs[chainName?.toLowerCase()] = chainId;
        } catch (error) {
          console.log("unable to connect: ", error);
        }
      }

      if (chainInfos.length === 0) {
        dispatch(
          setError({
            type: "error",
            message: "Permission denied for all the networks",
          })
        );
        return rejectWithValue("Permission denied for all the networks");
      } else {
        setConnected();
        return fulfillWithValue({
          chainInfos,
          nameToChainIDs,
          walletName,
          isNanoLedger
        });
      }

    }
  }
)

export const connectKeplrWallet = createAsyncThunk(
  "wallet/connect",
  async (network, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      if (!isKeplrInstalled()) {
        dispatch(
          setError({
            type: "error",
            message: "Keplr wallet is not installed",
          })
        );
        return rejectWithValue("Keplr wallet is not installed");
      } else {
        window.keplr.defaultOptions = {
          sign: {
            preferNoSetMemo: true,
            disableBalanceCheck: true,
          },
        };
        if (network.experimental) {
          await window.keplr.experimentalSuggestChain(network.config);
        }
        try {
          const result = await getKeplrWalletAmino(network.config.chainId);
          const walletInfo = await window.keplr.getKey(network.config.chainId);
          setConnected();
          return fulfillWithValue({
            walletInfo: walletInfo,
            result: result,
            network: network,
          });
        } catch (error) {
          dispatch(
            setError({
              type: "error",
              message: error.message || "",
            })
          );
          return rejectWithValue(error.message);
        }
      }
    } catch (error) {
      dispatch(
        setError({
          type: "error",
          message: error.message || "",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.address = action.payload.address;
      state.connected = true;
      state.chainInfo = action.payload.chainInfo;
    },
    resetWallet: (state) => {
      state.connected = false;
      state.address = "";
      state.algo = "";
      state.name = "";
      state.pubKey = "";
    },
    setNetwork: (state, action) => {
      state.chainInfo = action.payload.chainInfo;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectKeplrWallet.pending, () => { })
      .addCase(connectKeplrWallet.fulfilled, (state, action) => {
        const result = action.payload;
        state.name = result.walletInfo?.name;
        state.pubKey = toBase64(result.walletInfo?.pubKey);
        state.address = result.result[1].address;
        state.chainInfo = result.network;
        state.connected = true;
        state.isNanoLedger = action.payload?.walletInfo?.isNanoLedger || false;
      })
      .addCase(connectKeplrWallet.rejected, () => { })


      .addCase(connectKeplrWalletV1.pending, () => { })
      .addCase(connectKeplrWalletV1.fulfilled, (state, action) => {
        const networks = action.payload.chainInfos;
        const nameToChainIDs = action.payload.nameToChainIDs;
        state.networks = networks;
        state.nameToChainIDs = nameToChainIDs;
        state.connected = true;
        state.isNanoLedger = action.payload.isNanoLedger;
        state.name = action.payload.walletName;
      })
      .addCase(connectKeplrWalletV1.rejected, () => { });
  },
});

export const { setWallet, resetWallet, setNetwork } = walletSlice.actions;

export default walletSlice.reducer;
