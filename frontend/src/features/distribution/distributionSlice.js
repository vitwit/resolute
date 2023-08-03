import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import distService from "./service";
import { WithdrawAllRewardsMsg } from "../../txns/distr";
import { setError, setTxHash } from "../common/commonSlice";
import { signAndBroadcast } from "../../utils/signing";
import cloneDeep from "lodash/cloneDeep";

const initialState = {
  chains: {},
  defaultState: {
    delegatorRewards: {
      list: [],
      totalRewards: 0,
      status: "idle",
      errMsg: "",
      pagination: {},
    },
    authzDelegatorRewards: {},
    tx: {
      status: "idle",
      txHash: "",
    },
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
        data.chainID,
        data.aminoConfig,
        data.prefix,
        msgs,
        460000,
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
    return {
      data: response.data,
      chainID: data.chainID,
    };
  }
);

export const getAuthzDelegatorTotalRewards = createAsyncThunk(
  "distribution/authz-totalRewards",
  async (data) => {
    const response = await distService.delegatorRewards(
      data.baseURL,
      data.address,
      data.pagination
    );
    return {
      data: response.data,
      chainID: data.chainID,
    };
  }
);

export const distSlice = createSlice({
  name: "distribution",
  initialState,
  reducers: {
    resetTx: (state, action) => {
      let chainID = action.payload.chainID;
      state.chains[chainID].tx = initialState.defaultState.tx;
    },
    resetDefaultState: (state, action) => {
      let chainsMap = {};
      let chains = action.payload;
      chains.map((chainID) => {
        chainsMap[chainID] = cloneDeep(initialState.defaultState);
      });
      state.chains = chainsMap;
    },
    resetChainRewards: (state, action) => {
      let chainID = action.payload.chainID;
      state.chains[chainID].delegatorRewards.list = [];
      state.chains[chainID].delegatorRewards.totalRewards = 0;
      state.chains[chainID].delegatorRewards.status = "idle";
      state.chains[chainID].delegatorRewards.errMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDelegatorTotalRewards.pending, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].delegatorRewards.status = "pending";
        state.chains[chainID].delegatorRewards.errMsg = "";
        state.chains[chainID].delegatorRewards.totalRewards = 0;
        state.chains[chainID].delegatorRewards.list = [];
        state.chains[chainID].delegatorRewards.pagination = {};
      })
      .addCase(getDelegatorTotalRewards.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        if (state.chains[chainID]) {
          state.chains[chainID].delegatorRewards.status = "idle";
          state.chains[chainID].delegatorRewards.list =
            action.payload.data.rewards;
          let totalRewardsList = action?.payload?.data?.total;
          let total = 0;
          for (let i = 0; i < totalRewardsList.length; i++)
            total += +totalRewardsList[i].amount;
          state.chains[chainID].delegatorRewards.totalRewards = total;
          state.chains[chainID].delegatorRewards.pagination =
            action.payload.pagination;
          state.chains[chainID].delegatorRewards.errMsg = "";
        }
      })
      .addCase(getDelegatorTotalRewards.rejected, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        if (state.chains[chainID]) {
          state.chains[chainID].delegatorRewards.status = "rejected";
          state.chains[chainID].delegatorRewards.errMsg = action.error.message;
        }
      });

    builder
      .addCase(getAuthzDelegatorTotalRewards.pending, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        let granter = action.meta?.arg?.address;
        const result = {
          list: [],
          totalRewards: 0,
          status: "pending",
          errMsg: "",
          pagination: {},
        };
        state.chains[chainID].authzDelegatorRewards[granter] = result;
      })
      .addCase(getAuthzDelegatorTotalRewards.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        let granter = action.meta?.arg?.address;
        if (state.chains[chainID]) {
          const result = {
            list: action.payload.data.rewards,
            totalRewards: 0,
            status: "idle",
            errMsg: "",
            pagination: {},
          };
          let totalRewardsList = action?.payload?.data?.total;
          let total = 0;
          for (let i = 0; i < totalRewardsList.length; i++)
            total += +totalRewardsList[i].amount;
          result.totalRewards = total;
          state.chains[chainID].authzDelegatorRewards[granter] = result;
        }
      })
      .addCase(getAuthzDelegatorTotalRewards.rejected, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        let granter = action.meta?.arg?.address;
        let result = {
          list: [],
          totalRewards: 0,
          status: action.error.message,
          errMsg: "",
          pagination: {},
        };
        state.chains[chainID].authzDelegatorRewards[granter] = result;
      });

    builder
      .addCase(txWithdrawAllRewards.pending, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = "pending";
        state.chains[chainID].tx.txHash = "";
      })
      .addCase(txWithdrawAllRewards.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = "idle";
        state.chains[chainID].tx.txHash = action.payload.txHash;
      })
      .addCase(txWithdrawAllRewards.rejected, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = "rejected";
        state.chains[chainID].txHash = "";
      });
  },
});

export const { resetTx, resetDefaultState, resetChainRewards } =
  distSlice.actions;
export default distSlice.reducer;
