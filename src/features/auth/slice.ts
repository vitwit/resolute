import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SOMETHING_WRONG } from "../multisig/multisigSlice";
import service from "./service";

export interface AccountInfoState {
  status: "idle" | "pending" | "rejected";
  errMsg: string;
  account: any;
}

export interface AuthState {
  accountInfo: AccountInfoState;
}

const initialState: AuthState = {
  accountInfo: {
    status: "idle",
    errMsg: "",
    account: {},
  },
};

export const getAccountInfo = createAsyncThunk(
  "auth/accountInfo",
  async (data: any) => {
    const response = await service.accountInfo(data.baseURL, data.address);
    return response.data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAccountInfo: (state: any) => {
      state.accountInfo = initialState.accountInfo;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccountInfo.pending, (state) => {
        state.accountInfo.status = "pending";
        state.accountInfo.errMsg = "";
      })
      .addCase(getAccountInfo.fulfilled, (state, action) => {
        state.accountInfo.status = "idle";
        state.accountInfo.errMsg = "";
        state.accountInfo.account = action.payload?.account || {};
      })
      .addCase(getAccountInfo.rejected, (state, action) => {
        state.accountInfo.status = "rejected";
        state.accountInfo.errMsg = action.error?.message || SOMETHING_WRONG;
        state.accountInfo.account = {};
      });
  },
});

export const { resetAccountInfo } = authSlice.actions;

export default authSlice.reducer;
