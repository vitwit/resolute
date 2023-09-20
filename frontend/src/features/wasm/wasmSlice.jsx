import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import wasmService from "./wasmService";

const initialState = {
  codes: {},
};

export const getCodes = createAsyncThunk("wasm/codes", async (data) => {
  const response = await wasmService.codes(data.baseURL, data.pagination);
  return {
    chainID: data.chainID,
    data: response.data,
  };
});

export const wasmSlice = createSlice({
  name: "wasm",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCodes.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID || "";
        if (chainID.length) {
          let result = {
            codes: [],
            pagination: {},
            status: "pending",
            errMsg: "",
          };
          state.codes[chainID] = result;
        }
      })
      .addCase(getCodes.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID || "";
        if (chainID.length) {
          let result = {
            codes: action.payload?.data?.code_infos,
            pagination: action.payload?.data?.pagination,
            status: "idle",
            errMsg: "",
          };
          state.codes[chainID] = result;
        }
      })
      .addCase(getCodes.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID || "";
        if (chainID.length) {
          let result = {
            codes: [],
            pagination: {},
            status: "rejected",
            errMsg: action.error.message,
          };
          state.codes[chainID] = result;
        }
      });
  },
});

export default wasmSlice.reducer;
