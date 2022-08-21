import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  errState: {
    message: "",
    type: "",
  },
  txSuccess: {
    hash: "",
  },
  selectedNetwork: "",
};

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
    setSelectedNetwork: (state, action) => {
      state.selectedNetwork = action.payload;
    },
  },
});

export const {
  setError,
  resetError,
  setTxHash,
  resetTxHash,
  setSelectedNetwork,
} = commonSlice.actions;

export default commonSlice.reducer;
