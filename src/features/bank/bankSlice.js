import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SendMsg } from "../../txns/bank";
import bankService from "./bankService";
import { fee, getKeplrWalletAmino, signAndBroadcastAmino } from "../../txns/execute";
import { setError, setTxHash } from "../common/commonSlice";
import { signAndBroadcast } from "../../utils/signing";

const initialState = {
  balances: {
    list: [],
    status: "idle",
    errMsg: "",
  },
  balance: {
    balance: {},
    status: "idle",
    errMsg: "",
  },
  tx: {
    status: "idle",
  },
};

export const getBalances = createAsyncThunk("bank/balances", async (data) => {
  const response = await bankService.balances(
    data.baseURL,
    data.address,
    data.pagination
  );
  return response.data;
});

export const getBalance = createAsyncThunk("bank/balance", async (data) => {
  const response = await bankService.balance(
    data.baseURL,
    data.address,
    data.denom
  );
  return response.data;
});

export const txBankSend = createAsyncThunk(
  "bank/tx-bank-send",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = SendMsg(data.from, data.to, data.amount, data.denom);
      const result = await signAndBroadcast(
        data.chainId,
        {
          authzSupport: false,
          feegrantSupport: false,
          groupSupport: false,
        },
        [msg],
        260000,
        "hello world",
        "0.2stake",
        data.rest
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBalances.pending, (state) => {
        state.balances.status = "pending";
        state.balances.errMsg = "";
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        state.balances.status = "idle";
        state.balances.list = action.payload.balances;
        state.balances.errMsg = "";
      })
      .addCase(getBalances.rejected, (state, action) => {
        state.balances.status = "rejected";
        state.balances.errMsg = action.error.message;
        state.balances.list = [];
      });

    builder
      .addCase(getBalance.pending, (state) => {
        state.balance.status = "pending";
        state.balance.errMsg = "";
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.balance.status = "idle";
        state.balance.balance = action.payload.balance;
        state.balance.errMsg = "";
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.balance.status = "rejected";
        state.balance.errMsg = action.error.message;
        state.balance.balance = {};
      })
      .addCase(txBankSend.pending, (state) => {
        state.tx.status = "pending";
      })
      .addCase(txBankSend.fulfilled, (state, _) => {
        state.tx.status = "idle";
      })
      .addCase(txBankSend.rejected, (state, _) => {
        state.tx.status = "rejected";
      });
  },
});

export default bankSlice.reducer;
