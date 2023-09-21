import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import wasmService from "./wasmService";

const initialState = {
  codes: {},
  contracts: {},
};

export const getCodes = createAsyncThunk("wasm/codes", async (data) => {
  const response = await wasmService.codes(data.baseURL, data.pagination);
  return {
    chainID: data.chainID,
    data: response.data,
  };
});

export const getContractsByCode = createAsyncThunk(
  "wasm/contracts",
  async (data) => {
    const response = await wasmService.contracts(data.baseURL, data.codeId, data.pagination);
    return {
      chainID: data.chainID,
      data: response.data,
    };
  }
);

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
      })

      .addCase(getContractsByCode.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID || "";
        if (chainID.length) {
          let result = {
            contracts: [],
            pagination: {},
            status: "pending",
            errMsg: "",
          };
          state.contracts[chainID] = result;
        }
      })
      .addCase(getContractsByCode.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID || "";
        if (chainID.length) {
          let result = {
            contracts: action.payload?.data?.contracts,
            pagination: action.payload?.data?.pagination,
            status: "idle",
            errMsg: "",
          };
          state.contracts[chainID] = result;
        }
      })
      .addCase(getContractsByCode.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID || "";
        if (chainID.length) {
          let result = {
            contracts: [],
            pagination: {},
            status: "rejected",
            errMsg: action.error.message,
          };
          state.contracts[chainID] = result;
        }
      });
  },
});

export default wasmSlice.reducer;
