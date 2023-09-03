import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SOMETHING_WRONG } from "../multisig/multisigSlice";
import commonService from "./commonService";

const initialState = {
  errState: {
    message: "",
    type: "",
  },
  txSuccess: {
    hash: "",
  },
  txLoadRes: { load: false },
  tokensInfoState: {
    error: "",
    info: {},
    status: "idle",
  },
  allTokensInfoState: {
    error: "",
    info: {},
    status: "idle",
  },
  feegrant: {},
  selectedNetwork: {
    chainName: "",
  },
  icnsNames: {},
  selectedNetworkLocal: {
    chainName: "cosmoshub",
  },
  authzMode: false,
};

export const getTokenPrice = createAsyncThunk(
  "common/getTokenPrice",
  async (data, { rejectWithValue }) => {
    try {
      const response = await commonService.tokenInfo(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
    }
  }
);

export const getAllTokensPrice = createAsyncThunk(
  "common/getAllTokensPrice",
  async (data, { rejectWithValue }) => {
    try {
      const response = await commonService.allTokensInfo();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
    }
  }
);

export const getICNSName = createAsyncThunk(
  "common/getICNSName",
  async (data, { rejectWithValue }) => {
    try {
      const response = await commonService.fetchICNSName({
        address: data.address,
      });
      return {
        data: response.data,
        address: data.address,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
    }
  }
);

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.errState = {
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    setTxHash: (state, action) => {
      state.txSuccess = {
        hash: action.payload.hash,
      };
    },
    setTxLoad: (state) => {
      state.txLoadRes = { load: true };
    },
    resetTxLoad: (state) => {
      state.txLoadRes = { load: false };
    },
    resetTxHash: (state) => {
      state.txSuccess = {
        hash: "",
      };
    },
    resetError: (state) => {
      state.errState = {
        message: "",
        type: "",
      };
    },
    resetDecisionPolicies: (state) => {
      state.groupPolicies = {};
    },
    setFeegrant: (state, data) => {
      const chainName = data.payload.chainName;
      state.feegrant[chainName] = data.payload.grants;
    },
    resetFeegrant: (state) => {
      state.feegrant = initialState.feegrant;
    },
    removeFeegrant: (state, data) => {
      delete state.feegrant[data.payload];
    },
    setSelectedNetwork: (state, data) => {
      state.selectedNetwork.chainName = data.payload.chainName;
    },
    setSelectedNetworkLocal: (state, data) => {
      state.selectedNetworkLocal.chainName = data.payload.chainName.toLowerCase();
    },
    setAuthzMode: (state, data) => {
      state.authzMode = data.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTokenPrice.pending, (state) => {
        state.tokensInfoState.status = "pending";
        state.tokensInfoState.error = "";
      })
      .addCase(getTokenPrice.fulfilled, (state, action) => {
        state.tokensInfoState.status = "idle";
        state.tokensInfoState.error = "";
        state.tokensInfoState.info = action.payload.data || {};
      })
      .addCase(getTokenPrice.rejected, (state, action) => {
        state.tokensInfoState.status = "rejected";
        state.tokensInfoState.error = action.payload;
        state.tokensInfoState.info = {};
      });

    builder
      .addCase(getAllTokensPrice.pending, (state) => {
        state.allTokensInfoState.status = "pending";
        state.allTokensInfoState.error = "";
      })
      .addCase(getAllTokensPrice.fulfilled, (state, action) => {
        let data = action.payload.data || [];
        const tokensPriceInfo = data.reduce((result, tokenInfo) => {
          result[tokenInfo.denom] = tokenInfo;
          return result;
        }, {});
        state.allTokensInfoState.status = "idle";
        state.allTokensInfoState.error = "";
        state.allTokensInfoState.info = tokensPriceInfo;
      })
      .addCase(getAllTokensPrice.rejected, (state, action) => {
        state.allTokensInfoState.status = "rejected";
        state.allTokensInfoState.error = action.payload;
        state.allTokensInfoState.info = {};
      });

    builder
      .addCase(getICNSName.pending, (state) => {})
      .addCase(getICNSName.fulfilled, (state, action) => {
        const address = action.payload?.address || "";
        if (address?.length) {
          let result = {
            name: action.payload?.data?.data?.primary_name,
            status: "idle",
            errMsg: "",
          };
          state.icnsNames[address] = result;
        }
      })
      .addCase(getICNSName.rejected, (state) => {});
  },
});

export const {
  setError,
  resetError,
  resetDecisionPolicies,
  setTxLoad,
  resetTxLoad,
  setTxHash,
  resetTxHash,
  setFeegrant,
  resetFeegrant,
  setSelectedNetwork,
  setAuthzMode,
  removeFeegrant,
  setSelectedNetworkLocal,
} = commonSlice.actions;

export default commonSlice.reducer;
