import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SendMsg } from "../../txns/bank";
import bankService from "./service";
import { setError, setTxHash } from "../common/commonSlice";
import { signAndBroadcast } from "../../utils/signing";

const initialState = {
  balances: {},
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
  return {
    chainID: data.chainID,
    data: response.data,
  };
});

export const getBalance = createAsyncThunk("bank/balance", async (data) => {
  const response = await bankService.balance(
    data.baseURL,
    data.address,
    data.denom
  );
  return response.data;
});

export const multiTxns = createAsyncThunk(
  "bank/multi-txs",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        data.msgs,
        // null,
        260000,
        data.memo,
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
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

export const txBankSend = createAsyncThunk(
  "bank/tx-bank-send",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = SendMsg(data.from, data.to, data.amount, data.denom);
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
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
      .addCase(getBalances.pending, (state) => {})
      .addCase(getBalances.fulfilled, (state, action) => {
        const chainID = action.payload?.chainID || "";
        if (chainID.length > 0) {
          let result = {
            list: action.payload?.data?.balances,
            status: "idle",
            errMsg: "",
          };
          state.balances[chainID] = result;
        }
      })
      .addCase(getBalances.rejected, (state, action) => {});

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
      })
      .addCase(multiTxns.pending, (state) => {
        state.tx.status = "pending";
      })
      .addCase(multiTxns.fulfilled, (state, _) => {
        state.tx.status = "idle";
      })
      .addCase(multiTxns.rejected, (state, _) => {
        state.tx.status = "rejected";
      });
  },
});

export default bankSlice.reducer;
