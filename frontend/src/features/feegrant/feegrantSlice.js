import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  FeegrantBasicMsg,
  FeegrantPeriodicMsg,
  FeegrantRevokeMsg,
} from "../../txns/feegrant";
import feegrantService from "./feegrantService";
import {
  resetTxLoad,
  setError,
  setTxHash,
  setTxLoad,
} from "../common/commonSlice";
import { FeegrantFilterMsg } from "../../txns/feegrant/grant";
import { signAndBroadcast } from "../../utils/signing";

const initialState = {
  grantsToMe: {
    status: "idle",
    grants: [],
  },
  errState: {
    message: "",
    type: "",
  },
  grantsByMe: {
    status: "idle",
    grants: [],
  },
  tx: {
    status: "idle",
    type: "",
  },
  txFilterRes: {},
  txFeegrantBasicRes: {},
  txGrantPeriodicRes: {},
};

export const getGrantsToMe = createAsyncThunk(
  "feegrant/grantsToMe",
  async (data) => {
    const response = await feegrantService.grantsToMe(
      data.baseURL,
      data.grantee,
      data.pagination
    );
    return response.data;
  }
);

export const getGrantsByMe = createAsyncThunk(
  "feegrant/grantsByMe",
  async (data) => {
    const response = await feegrantService.grantsByMe(
      data.baseURL,
      data.granter,
      data.pagination
    );
    return response.data;
  }
);

export const txFeegrantBasic = createAsyncThunk(
  "feegrant/tx-basic",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setTxLoad());
      const msg = FeegrantBasicMsg(
        data.granter,
        data.grantee,
        data.denom,
        data.spendLimit,
        data.expiration
      );
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
      dispatch(resetTxLoad());
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
      dispatch(resetTxLoad());
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

export const txGrantPeriodic = createAsyncThunk(
  "feegrant/tx-periodic",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    dispatch(setTxLoad());
    try {
      const msg = FeegrantPeriodicMsg(
        data.granter,
        data.grantee,
        data.denom,
        data.spendLimit,
        data.period,
        data.periodSpendLimit,
        data.expiration
      );
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
      dispatch(resetTxLoad());
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
      dispatch(resetTxLoad());
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

export const txGrantFilter = createAsyncThunk(
  "feegrant/tx-filter",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    dispatch(setTxLoad());
    try {
      const msg = FeegrantFilterMsg(
        data.granter,
        data.grantee,
        data.denom,
        data.spendLimit,
        data.period,
        data.periodSpendLimit,
        data.expiration,
        data.txType || [],
        data.allowanceType
      );

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
      dispatch(resetTxLoad());
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
      dispatch(resetTxLoad());
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

export const txRevoke = createAsyncThunk(
  "feegrant/tx-revoke",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setTxLoad());
      const msg = FeegrantRevokeMsg(data.granter, data.grantee);
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data?.feegranter?.length > 0 ? data.feegranter : undefined
      );
      dispatch(resetTxLoad());
      if (result?.code === 0) {
        dispatch(
          getGrantsByMe({
            baseURL: data.baseURL,
            granter: data.granter,
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
      dispatch(resetTxLoad());

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

export const feegrantSlice = createSlice({
  name: "feegrant",
  initialState,
  reducers: {
    resetAlerts: (state) => {
      state.errState = {
        status: "idle",
        message: "",
        type: "",
      };
    },
    resetFeeFilter: (state) => {
      state.txFilterRes = {};
    },
    resetFeeBasic: (state) => {
      state.txFeegrantBasicRes = {};
    },
    resetFeePeriodic: (state) => {
      state.txGrantPeriodicRes = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGrantsToMe.pending, (state) => {
        state.grantsToMe.status = "pending";
        state.grantsToMe.grants = [];
        state.errState = {
          message: "",
          type: "",
        };
      })
      .addCase(getGrantsToMe.fulfilled, (state, action) => {
        state.grantsToMe.status = "idle";
        state.grantsToMe.grants = action.payload?.allowances;
        state.grantsToMe.pagination = action.payload?.pagination;
        state.errState = {
          message: "",
          type: "",
        };
      })
      .addCase(getGrantsToMe.rejected, (state, action) => {
        state.grantsToMe.status = "rejected";
        state.grantsToMe.grants = [];
        state.errState = {
          message: action.error.message,
          type: "error",
        };
      });

    builder
      .addCase(getGrantsByMe.pending, (state) => {
        state.grantsByMe.status = "pending";
        state.errState = {
          message: "",
          type: "",
        };
      })
      .addCase(getGrantsByMe.fulfilled, (state, action) => {
        state.grantsByMe.status = "idle";
        state.grantsByMe.grants = action.payload?.allowances;
        state.grantsByMe.pagination = action.payload?.pagination;
        state.errState = {
          message: "",
          type: "",
        };
      })
      .addCase(getGrantsByMe.rejected, (state, action) => {
        state.grantsByMe.status = "rejected";
        state.errState = {
          message: action.error.message,
          type: "error",
        };
      });

    // txns
    builder
      .addCase(txFeegrantBasic.pending, (state) => {
        state.tx.status = `pending`;
        state.tx.type = `basic`;
        state.txFeegrantBasicRes.status = `pending`;
      })
      .addCase(txFeegrantBasic.fulfilled, (state, _) => {
        state.tx.status = `idle`;
        state.tx.type = `basic`;
        state.txFeegrantBasicRes.status = `idle`;
      })
      .addCase(txFeegrantBasic.rejected, (state, _) => {
        state.tx.status = `rejected`;
        state.tx.type = "basic";
        state.txFeegrantBasicRes.status = `rejected`;
      });

    builder
      .addCase(txGrantPeriodic.pending, (state) => {
        state.tx.status = `pending`;
        state.tx.type = `periodic`;
        state.txGrantPeriodicRes.status = `pending`;
      })
      .addCase(txGrantPeriodic.fulfilled, (state, _) => {
        state.tx.status = `idle`;
        state.tx.type = `periodic`;
        state.txGrantPeriodicRes.status = `idle`;
      })
      .addCase(txGrantPeriodic.rejected, (state, _) => {
        state.tx.status = `rejected`;
        state.tx.type = "periodic";
        state.txGrantPeriodicRes.status = `rejected`;
      });

    builder
      .addCase(txRevoke.pending, (state) => {
        state.tx.status = `pending`;
        state.tx.type = `revoke`;
      })
      .addCase(txRevoke.fulfilled, (state, _) => {
        state.tx.status = `idle`;
        state.tx.type = `revoke`;
      })
      .addCase(txRevoke.rejected, (state, _) => {
        state.tx.status = `rejected`;
        state.tx.type = "revoke";
      });

    builder
      .addCase(txGrantFilter.pending, (state) => {
        state.txFilterRes.status = `pending`;
      })
      .addCase(txGrantFilter.fulfilled, (state, _) => {
        state.txFilterRes.status = `idle`;
      })
      .addCase(txGrantFilter.rejected, (state, _) => {
        state.txFilterRes.status = `rejected`;
      });
  },
});

export const { resetAlerts, resetFeeFilter, resetFeeBasic, resetFeePeriodic } = feegrantSlice.actions;

export default feegrantSlice.reducer;
