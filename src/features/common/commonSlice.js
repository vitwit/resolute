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
  feegrant: {
    granter: "",
    grantee: ""
  }
  
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
    resetActiveProposals: (state) => {
      state.policyProposals = {};
    },
    setFeegrant: (state, data) => {
      state.feegrant = data.payload;
    },
    resetFeegrant: (state) => {
      state.feegrant = initialState.feegrant;
    }
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
  },
});

export const {
  setError,
  resetError,
  resetActiveProposals,
  resetDecisionPolicies,
  setTxLoad,
  resetTxLoad,
  setTxHash,
  resetTxHash,
  setFeegrant,
  resetFeegrant,
} = commonSlice.actions;

export default commonSlice.reducer;
