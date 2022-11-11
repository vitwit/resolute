import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Delegate, UnDelegate, Redelegate } from "../../txns/staking";
import stakingService from "./stakingService";
import { setError, setTxHash } from "../common/commonSlice";
import { SOMETHING_WRONG } from "../multisig/multisigSlice";
import { signAndBroadcast } from "../../utils/signing";

const initialState = {
  validators: {
    status: "idle",
    active: {},
    inactive: {},
    activeSorted: [],
    inactiveSorted: [],
    errMsg: "",
    pagination: {
      next_key: null,
    },
    totalActive: 0,
    totalInactive: 0,
    witvalValidator: {},
  },
  delegations: {
    status: "idle",
    delegations: [],
    errMsg: "",
    pagination: {},
    delegatedTo: {},
    totalStaked: 0.0,
  },
  unbonding: {
    status: "idle",
    delegations: [],
    errMsg: "",
    pagination: {},
  },
  params: {},
  pool: {},
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

      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter.length > 0 ? data.feegranter : undefined
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
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter.length > 0 ? data.feegranter : undefined
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
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter.length > 0 ? data.feegranter : undefined
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

export const getPoolInfo = createAsyncThunk(
  "staking/poolInfo",
  async (data) => {
    const response = await stakingService.poolInfo(data.baseURL);
    return response.data;
  }
);

export const getValidators = createAsyncThunk(
  "staking/validators",
  async (data, { rejectWithValue }) => {
    try {
      const response = await stakingService.validators(
        data.baseURL,
        data?.status,
        data.pagination
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getAllValidators = createAsyncThunk(
  "staking/all-validators",
  async (data, { rejectWithValue }) => {
    try {
      const validators = [];
      let nextKey = null;
      const limit = 100;
      while (true) {
        const response = await stakingService.validators(
          data.baseURL,
          data?.status,
          nextKey
            ? {
                key: nextKey,
                limit: limit,
              }
            : {}
        );
        validators.push(...response.data.validators);
        if (!response.data.pagination?.next_key) {
          break;
        }
        nextKey = response.data.pagination.next_key;
      }
      return validators;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getParams = createAsyncThunk("staking/params", async (data) => {
  const response = await stakingService.params(data.baseURL);
  return response.data;
});

export const getDelegations = createAsyncThunk(
  "staking/delegations",
  async (data, { rejectWithValue }) => {
    try {
      const delegations = [];
      let nextKey = null;
      const limit = 100;
      while (true) {
        const response = await stakingService.delegations(
          data.baseURL,
          data.address,
          nextKey
            ? {
                key: nextKey,
                limit: limit,
              }
            : {}
        );
        delegations.push(...(response.data?.delegation_responses || []));
        if (!response.data.pagination?.next_key) {
          break;
        }
        nextKey = response.data.pagination.next_key;
      }
      return delegations;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
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

      state.validators.activeSorted = Object.keys(activeSort);

      const inactiveSort = Object.fromEntries(
        Object.entries(state.validators.inactive).sort(([, a], [, b]) => {
          return b.tokens - a.tokens;
        })
      );
      state.validators.inactiveSorted = Object.keys(inactiveSort);
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
          if (
            element.status === "BOND_STATUS_BONDED" &&
            !state.validators.active[element.operator_address]
          ) {
            state.validators.active[element.operator_address] = element;
            state.validators.totalActive += 1;
            if (element?.description?.moniker === "Witval") {
              state.validators.witvalValidator = element;
            }
          } else if (
            element.status !== "BOND_STATUS_BONDED" &&
            !state.validators.inactive[element.operator_address]
          ) {
            state.validators.inactive[element.operator_address] = element;
            state.validators.totalInactive += 1;
            if (element?.description?.moniker === "Witval") {
              state.validators.witvalValidator = element;
            }
          }
        }
        state.validators.pagination = action.payload.pagination;
        state.validators.errMsg = "";
      })
      .addCase(getValidators.rejected, (state, action) => {
        state.validators.status = "rejected";
        state.validators.errMsg = action.error.message;
        let result = initialState.validators;
        result.errMsg = action.error.message;
        result.status = "rejected";
        state.validators = result;
      });

    builder
      .addCase(getAllValidators.pending, (state) => {
        state.validators.status = "pending";
        state.validators.errMsg = "";
      })
      .addCase(getAllValidators.fulfilled, (state, action) => {
        state.validators.status = "idle";
        let result = {};
        result.validators = action.payload;
        const res = action.payload;
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          if (
            element.status === "BOND_STATUS_BONDED" &&
            !state.validators.active[element.operator_address]
          ) {
            state.validators.active[element.operator_address] = element;
            state.validators.totalActive += 1;
            if (element?.description?.moniker === "Witval") {
              state.validators.witvalValidator = element;
            }
          } else if (
            element.status !== "BOND_STATUS_BONDED" &&
            !state.validators.inactive[element.operator_address]
          ) {
            state.validators.inactive[element.operator_address] = element;
            state.validators.totalInactive += 1;
            if (element?.description?.moniker === "Witval") {
              state.validators.witvalValidator = element;
            }
          }
        }
        state.validators.errMsg = "";

        const activeSort = Object.fromEntries(
          Object.entries(state.validators.active).sort(([, a], [, b]) => {
            return b.tokens - a.tokens;
          })
        );

        state.validators.activeSorted = Object.keys(activeSort);

        const inactiveSort = Object.fromEntries(
          Object.entries(state.validators.inactive).sort(([, a], [, b]) => {
            return b.tokens - a.tokens;
          })
        );
        state.validators.inactiveSorted = Object.keys(inactiveSort);
      })
      .addCase(getAllValidators.rejected, (state, action) => {
        let result = initialState.validators;
        result.errMsg = action.error.message;
        result.status = "rejected";
        state.validators = result;
      });

    builder
      .addCase(getDelegations.pending, (state) => {
        state.delegations.status = "pending";
        state.delegations.errMsg = "";
      })
      .addCase(getDelegations.fulfilled, (state, action) => {
        state.delegations.status = "idle";
        state.delegations.delegations = action.payload;
        state.delegations.errMsg = "";

        let total = 0.0;
        for (let i = 0; i < action.payload.length; i++) {
          const delegation = action.payload[i];
          state.delegations.delegatedTo[
            delegation?.delegation?.validator_address
          ] = true;
          total += parseFloat(delegation?.delegation?.shares);
        }
        state.delegations.totalStaked = total;
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

    // pool info
    builder
      .addCase(getPoolInfo.pending, (state) => {})
      .addCase(getPoolInfo.fulfilled, (state, action) => {
        state.pool = action.payload;
      })
      .addCase(getPoolInfo.rejected, (state, action) => {});
  },
});

export const {
  resetState,
  sortValidatorsByVotingPower,
  resetDelegations,
  resetTxType,
} = stakeSlice.actions;

export default stakeSlice.reducer;
