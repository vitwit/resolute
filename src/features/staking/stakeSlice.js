import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Delegate, UnDelegate, Redelegate } from "../../txns/staking";
import stakingService from "./stakingService";
import { signAndBroadcastAmino, fee } from "../../txns/execute";
import { setError, setTxHash } from "../common/commonSlice";
import { createMultisigAccount } from "../multisig/multisigService";

const initialState = {
  validators: {
    status: "idle",
    active: {},
    inactive: {},
    activeSorted: {},
    inactiveSorted: {},
    errMsg: "",
    pagination: {
      next_key: null,
    },
  },
  delegations: {
    status: "idle",
    delegations: [],
    errMsg: "",
    pagination: {},
  },
  unbonding: {
    status: "idle",
    delegations: [],
    errMsg: "",
    pagination: {},
  },
  params: {},
  tx: {
    status: "idle",
    type: "",
  },
};

export const txDelegate = createAsyncThunk(
  "staking/delegate",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = Delegate(
        data.delegator,
        data.validator,
        data.amount,
        data.denom
      );
      const result = await signAndBroadcastAmino(
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        dispatch(resetDelegations());
        dispatch(
          getDelegations({
            baseURL: data.baseURL,
            address: data.delegator,
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

export const txReDelegate = createAsyncThunk(
  "staking/redelegate",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = Redelegate(
        data.delegator,
        data.srcVal,
        data.destVal,
        data.amount,
        data.denom
      );
      const result = await signAndBroadcastAmino(
        [msg],
        fee(data.denom, data.feeAmount, 280000),
        data.chainId,
        data.rpc
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        dispatch(resetDelegations());
        dispatch(
          getDelegations({
            baseURL: data.baseURL,
            address: data.delegator,
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

export const txUnDelegate = createAsyncThunk(
  "staking/undelegate",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = UnDelegate(
        data.delegator,
        data.validator,
        data.amount,
        data.denom
      );
      const result = await signAndBroadcastAmino(
        [msg],
        fee(data.denom, data.feeAmount, 260000),
        data.chainId,
        data.rpc
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

export const getValidators = createAsyncThunk(
  "staking/validators",
  async (data) => {
    const response = await stakingService.validators(
      data.baseURL,
      data?.status,
      data.pagination
    );
    return response.data;
  }
);

export const createMultiAccount = createAsyncThunk(
  "staking/createaMultiAccount",
  async (data) => {
    const response = await createMultisigAccount(data);
    return response.data;
  }
);

export const getParams = createAsyncThunk("staking/params", async (data) => {
  const response = await stakingService.params(data.baseURL);
  return response.data;
});

export const getDelegations = createAsyncThunk(
  "staking/delegations",
  async (data) => {
    const response = await stakingService.delegations(
      data.baseURL,
      data.address,
      data.pagination
    );
    return response.data;
  }
);

export const getUnbonding = createAsyncThunk(
  "staking/unbonding",
  async (data) => {
    const response = await stakingService.unbonding(
      data.baseURL,
      data.address,
      data.pagination
    );
    return response.data;
  }
);

export const stakeSlice = createSlice({
  name: "staking",
  initialState,
  reducers: {
    resetTxType: (state, _) => {
      state.tx.type = "";
    },
    validators: (state, action) => {
      state.validators = action.payload;
    },
    delegations: (state, action) => {
      state.delegations = action.payload;
    },
    resetState: (state, action) => {
      state.validators = initialState.validators;
      state.delegations = initialState.delegations;
    },
    resetDelegations: (state) => {
      state.delegations = initialState.delegations;
    },
    sortValidatorsByVotingPower: (state) => {
      const activeSort = Object.fromEntries(
        Object.entries(state.validators.active).sort(([, a], [, b]) => {
          return b.tokens - a.tokens;
        })
      );
      state.validators.active = activeSort;

      const inactiveSort = Object.fromEntries(
        Object.entries(state.validators.inactive).sort(([, a], [, b]) => {
          return b.tokens - a.tokens;
        })
      );
      state.validators.inactive = inactiveSort;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getValidators.pending, (state) => {
        state.validators.status = "pending";
        state.validators.errMsg = "";
      })
      .addCase(getValidators.fulfilled, (state, action) => {
        state.validators.status = "idle";
        let result = {};
        result.validators = action.payload.validators;
        const res = action.payload.validators;
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          if (element.status === "BOND_STATUS_BONDED") {
            state.validators.active[element.operator_address] = element;
          } else {
            state.validators.inactive[element.operator_address] = element;
          }
        }
        state.validators.pagination = action.payload.pagination;
        state.validators.errMsg = "";
      })
      .addCase(getValidators.rejected, (state, action) => {
        state.validators.status = "rejected";
        state.validators.errMsg = action.error.message;
      });

    builder
      .addCase(getDelegations.pending, (state) => {
        state.delegations.status = "pending";
        state.delegations.errMsg = "";
      })
      .addCase(getDelegations.fulfilled, (state, action) => {
        state.delegations.status = "idle";
        state.delegations.delegations = action.payload.delegation_responses;
        state.delegations.pagination = action.payload.pagination;
        state.delegations.errMsg = "";
      })
      .addCase(getDelegations.rejected, (state, action) => {
        state.delegations.status = "rejected";
        state.delegations.errMsg = action.error.message;
      });

    builder
      .addCase(getUnbonding.pending, (state) => {
        state.unbonding.status = "pending";
        state.unbonding.errMsg = "";
      })
      .addCase(getUnbonding.fulfilled, (state, action) => {
        state.unbonding.status = "idle";
        state.unbonding.delegations = action.payload.unbonding_responses;
        state.unbonding.pagination = action.payload.pagination;
        state.unbonding.errMsg = "";
      })
      .addCase(getUnbonding.rejected, (state, action) => {
        state.unbonding.status = "rejected";
        state.unbonding.errMsg = action.error.message;
      });

    builder
      .addCase(getParams.pending, (state) => {})
      .addCase(getParams.fulfilled, (state, action) => {
        state.params = action.payload;
      })
      .addCase(getParams.rejected, (state, action) => {});

    builder
      .addCase(txDelegate.pending, (state) => {
        state.tx.status = "pending";
        state.tx.type = "";
      })
      .addCase(txDelegate.fulfilled, (state, _) => {
        state.tx.status = "idle";
        state.tx.type = "delegate";
      })
      .addCase(txDelegate.rejected, (state, _) => {
        state.tx.status = "rejected";
        state.tx.type = "";
      });

    builder
      .addCase(txUnDelegate.pending, (state) => {
        state.tx.status = "pending";
        state.tx.type = "";
      })
      .addCase(txUnDelegate.fulfilled, (state, _) => {
        state.tx.status = "idle";
        state.tx.type = "undelegate";
      })
      .addCase(txUnDelegate.rejected, (state, _) => {
        state.tx.status = "rejected";
        state.tx.type = "";
      });

    builder
      .addCase(txReDelegate.pending, (state) => {
        state.tx.status = "pending";
        state.tx.type = "";
      })
      .addCase(txReDelegate.fulfilled, (state, _) => {
        state.tx.status = "idle";
        state.tx.type = "redelegate";
      })
      .addCase(txReDelegate.rejected, (state, _) => {
        state.tx.status = "rejected";
        state.tx.type = "";
      });

    builder
      .addCase(createMultiAccount.pending, (state) => {
        console.log("pending", state);
        // state.createMultisigAccount.status = 'pending';
        // state.validators.errMsg = ''
      })
      .addCase(createMultiAccount.fulfilled, (state, action) => {
        console.log("fullfilled", state, action);
      })
      .addCase(createMultiAccount.rejected, (state, action) => {
        console.log("rejecteddddddd", state, action);
      });
  },
});

export const {
  resetState,
  sortValidatorsByVotingPower,
  resetDelegations,
  resetTxType,
} = stakeSlice.actions;

export default stakeSlice.reducer;
