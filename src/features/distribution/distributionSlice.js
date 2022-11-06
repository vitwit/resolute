import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import distService from "./distributionService";
import { WithdrawAllRewardsMsg } from "../../txns/distr";
import { setError, setTxHash } from "../common/commonSlice";
import { signAndBroadcast } from "../../utils/signing";

const initialState = {
  delegatorRewards: {
    list: [],
    status: "idle",
    errMsg: "",
    pagination: {},
  },
  tx: {
    status: "idle",
    txHash: "",
  },
};

export const txWithdrawAllRewards = createAsyncThunk(
  "distribution/withdraw-all-rewards",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msgs = [];
      for (let i = 0; i < data.msgs.length; i++) {
        const msg = data.msgs[i];
        msgs.push(WithdrawAllRewardsMsg(msg.delegator, msg.validator));
      }
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        msgs,
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
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
      return rejectWithValue(error.response);
    }
  }
);

export const getDelegatorTotalRewards = createAsyncThunk(
  "distribution/totalRewards",
  async (data) => {
    const response = await distService.delegatorRewards(
      data.baseURL,
      data.address,
      data.pagination
    );
    return response.data;
  }
);

export const distSlice = createSlice({
  name: "distribution",
  initialState,
  reducers: {
    resetTx: (state) => {
      state.tx = initialState.tx;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDelegatorTotalRewards.pending, (state) => {
        state.delegatorRewards.status = "pending";
        state.delegatorRewards.errMsg = "";
        state.delegatorRewards.list = [];
        state.delegatorRewards.pagination = {};
      })
      .addCase(getDelegatorTotalRewards.fulfilled, (state, action) => {
        state.delegatorRewards.status = "idle";
        state.delegatorRewards.list = action.payload.rewards;
        state.delegatorRewards.pagination = action.payload.pagination;
        state.delegatorRewards.errMsg = "";
      })
      .addCase(getDelegatorTotalRewards.rejected, (state, action) => {
        state.delegatorRewards.status = "rejected";
        state.delegatorRewards.errMsg = action.error.message;
      });

    builder
      .addCase(txWithdrawAllRewards.pending, (state) => {
        state.tx.status = "pending";
        state.tx.txHash = "";
      })
      .addCase(txWithdrawAllRewards.fulfilled, (state, action) => {
        state.tx.status = "idle";
        state.tx.txHash = action.payload.txHash;
      })
      .addCase(txWithdrawAllRewards.rejected, (state, action) => {
        state.tx.status = "rejected";
        state.txHash = "";
      });
  },
});

export const { resetTx } = distSlice.actions;
export default distSlice.reducer;
