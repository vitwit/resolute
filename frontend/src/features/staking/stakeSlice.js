import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Delegate, UnDelegate, Redelegate } from "../../txns/staking";
import stakingService from "./stakingService";
import { setError, setTxHash } from "../common/commonSlice";
import { SOMETHING_WRONG } from "../multisig/multisigSlice";
import { signAndBroadcast } from "../../utils/signing";
import cloneDeep from "lodash/cloneDeep";
import { getDenomBalance } from "../../utils/denom";

const initialState = {
  chains: {},
  defaultState: {
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
    authzDelegations: {},
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
  },
  overviewTx: {
    status: "",
  },
};

export const txRestake = createAsyncThunk(
  "staking/restake",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        data.msgs,
        368995,
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
      return rejectWithValue(error.response);
    }
  }
);

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
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        dispatch(resetDelegations({ chainID: data.chainId }));
        dispatch(
          getDelegations({
            baseURL: data.baseURL,
            address: data.delegator,
            chainID: data.chainId,
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
        data.feegranter?.length > 0 ? data.feegranter : undefined
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
            chainID: data.chainId,
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

export const getPoolInfo = createAsyncThunk(
  "staking/poolInfo",
  async (data) => {
    const response = await stakingService.poolInfo(data.baseURL);
    return {
      chainID: data.chainID,
      data: response.data,
    };
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
      return {
        chainID: data.chainID,
        data: response.data,
      };
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
      return {
        validators: validators,
        chainID: data.chainID,
      };
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getParams = createAsyncThunk("staking/params", async (data) => {
  const response = await stakingService.params(data.baseURL);
  return {
    data: response.data,
    chainID: data.chainID,
  };
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
      return {
        delegations: delegations,
        chainID: data.chainID,
      };
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getAuthzDelegations = createAsyncThunk(
  "staking/authz-delegations",
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
      return {
        delegations: delegations,
        chainID: data.chainID,
      };
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
    return {
      data: response.data,
      chainID: data.chainID,
    };
  }
);

export const stakeSlice = createSlice({
  name: "staking",
  initialState,
  reducers: {
    resetRestakeTx: (state) => {
      state.overviewTx.status = "";
    },
    resetTxType: (state, action) => {
      let chainID = action.payload.chainID;
      state.chains[chainID].tx.type = "";
    },
    validators: (state, action) => {
      let chainID = action.payload.chainID;
      let validators = action.payload.validators;
      state.chains[chainID].validators = validators;
    },
    delegations: (state, action) => {
      let chainID = action.payload.chainID;
      let delegations = action.payload.delegations;
      state.chains[chainID].delegations = delegations;
    },
    resetState: (state, action) => {
      let chainID = action.payload.chainID;
      state.chains[chainID] = cloneDeep(initialState.defaultState);
    },
    resetDefaultState: (state, action) => {
      let chainsMap = {};
      let chains = action.payload;
      chains.map((chainID) => {
        chainsMap[chainID] = cloneDeep(initialState.defaultState);
      });
      state.chains = chainsMap;
    },
    resetDelegations: (state, action) => {
      let chainID = action.payload.chainID;
      state.chains[chainID].delegations = initialState.defaultState.delegations;
    },
    addRewardsToDelegations: (state, action) => {
      let { chainID, rewardsList, totalRewards } = action.payload;
      let rewardsMap = new Map();
      for (let i = 0; i < rewardsList.length; i++) {
        rewardsMap[rewardsList[i].validator_address] = rewardsList[i].reward;
      }

      for (
        let i = 0;
        i <
        state?.chains?.[chainID]?.delegations?.delegations?.delegations?.length;
        i++
      ) {
        let delegation =
          state.chains[chainID].delegations.delegations.delegations[i];
        let validatorReward =
          rewardsMap[delegation?.delegation?.validator_address];
        if (!validatorReward) continue;
        let amount = getDenomBalance(validatorReward, delegation.balance.denom);
        delegation.delegation.shares = +delegation.delegation.shares + amount;
        delegation.balance.amount = +delegation.balance.amount + amount;
        state.chains[chainID].delegations.delegations.delegations[i] =
          delegation;
      }
      state.chains[chainID].delegations.totalStaked =
        +state.chains[chainID].delegations.totalStaked + +totalRewards;
    },
    sortValidatorsByVotingPower: (state, action) => {
      let chainID = action.payload.chainID;
      const activeSort = Object.fromEntries(
        Object.entries(state.chains[chainID].validators.active).sort(
          ([, a], [, b]) => {
            return b.tokens - a.tokens;
          }
        )
      );

      state.chains[chainID].validators.activeSorted = Object.keys(activeSort);

      const inactiveSort = Object.fromEntries(
        Object.entries(state.chains[chainID].validators.inactive).sort(
          ([, a], [, b]) => {
            return b.tokens - a.tokens;
          }
        )
      );
      state.chains[chainID].validators.inactiveSorted =
        Object.keys(inactiveSort);
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getValidators.pending, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validators.status = "pending";
        state.chains[chainID].validators.errMsg = "";
      })
      .addCase(getValidators.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validators.status = "idle";
        let result = {};
        result.validators = action.payload.validators;
        const res = action.payload.validators;
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          if (
            element.status === "BOND_STATUS_BONDED" &&
            !state.chains[chainID].validators.active[element.operator_address]
          ) {
            state.chains[chainID].validators.active[element.operator_address] =
              element;
            state.chains[chainID].validators.totalActive += 1;
            if (element?.description?.moniker === "Witval") {
              state.chains[chainID].validators.witvalValidator = element;
            }
          } else if (
            element.status !== "BOND_STATUS_BONDED" &&
            !state.chains[chainID].validators.inactive[element.operator_address]
          ) {
            state.chains[chainID].validators.inactive[
              element.operator_address
            ] = element;
            state.chains[chainID].validators.totalInactive += 1;
            if (element?.description?.moniker === "Witval") {
              state.chains[chainID].validators.witvalValidator = element;
            }
          }
        }
        state.chains[chainID].validators.pagination = action.payload.pagination;
        state.chains[chainID].validators.errMsg = "";
      })
      .addCase(getValidators.rejected, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validators.status = "rejected";
        state.chains[chainID].validators.errMsg = action.error.message;
        let result = initialState.defaultState.validators;
        result.errMsg = action.error.message;
        result.status = "rejected";
        state.chains[chainID].validators = result;
      });

    builder
      .addCase(getAllValidators.pending, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validators.status = "pending";
        state.chains[chainID].validators.errMsg = "";
      })
      .addCase(getAllValidators.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validators.status = "idle";
        let result = {};
        result.validators = action.payload.validators;
        const res = action.payload.validators;
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          if (
            element.status === "BOND_STATUS_BONDED" &&
            !state.chains[chainID].validators.active[element.operator_address]
          ) {
            state.chains[chainID].validators.active[element.operator_address] =
              element;
            state.chains[chainID].validators.totalActive += 1;
            if (element?.description?.moniker === "Witval") {
              state.chains[chainID].validators.witvalValidator = element;
            }
          } else if (
            element.status !== "BOND_STATUS_BONDED" &&
            !state.chains[chainID].validators.inactive[element.operator_address]
          ) {
            state.chains[chainID].validators.inactive[
              element.operator_address
            ] = element;
            state.chains[chainID].validators.totalInactive += 1;
            if (element?.description?.moniker === "Witval") {
              state.chains[chainID].validators.witvalValidator = element;
            }
          }
        }
        state.chains[chainID].validators.errMsg = "";

        let customSort = ([, a], [, b]) => {
          return b.tokens - a.tokens;
        };

        const activeSort = Object.fromEntries(
          Object.entries(state.chains[chainID].validators.active).sort(
            customSort
          )
        );

        state.chains[chainID].validators.activeSorted = Object.keys(activeSort);

        const inactiveSort = Object.fromEntries(
          Object.entries(state.chains[chainID].validators.inactive).sort(
            customSort
          )
        );
        state.chains[chainID].validators.inactiveSorted =
          Object.keys(inactiveSort);
      })
      .addCase(getAllValidators.rejected, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        let result = cloneDeep(initialState.defaultState.validators);
        result.errMsg = action.error.message;
        result.status = "rejected";
        if (state.chains[chainID]) {
          state.chains[chainID].validators = result;
        }
      });

    builder
      .addCase(getDelegations.pending, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].delegations.status = "pending";
        state.chains[chainID].delegations.errMsg = "";
      })
      .addCase(getDelegations.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].delegations.status = "idle";
        state.chains[chainID].delegations.delegations = action.payload;
        state.chains[chainID].delegations.errMsg = "";

        let total = 0.0;
        for (let i = 0; i < action.payload.delegations.length; i++) {
          const delegation = action.payload.delegations[i];
          state.chains[chainID].delegations.delegatedTo[
            delegation?.delegation?.validator_address
          ] = true;
          total += parseFloat(delegation?.delegation?.shares);
        }
        state.chains[chainID].delegations.totalStaked = total;
      })
      .addCase(getDelegations.rejected, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        if (state.chains[chainID]) {
          state.chains[chainID].delegations.status = "rejected";
          state.chains[chainID].delegations.errMsg = action.error.message;
        }
      });

    builder
      .addCase(getAuthzDelegations.pending, (state, action) => {
        let chainID = action.meta?.arg?.chainID || "";
        let granter = action.meta?.arg?.address || "";
        if (chainID.length && granter.length) {
          const result = {
            status: "pending",
            delegations: [],
            errMsg: "",
            pagination: {},
            delegatedTo: {},
            totalStaked: 0.0,
          };
          state.chains[chainID].authzDelegations[granter] = result;
        }
      })
      .addCase(getAuthzDelegations.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        let granter = action.meta?.arg?.address;
        if (chainID.length && granter.length) {
          const result = {
            status: "idle",
            delegations: action.payload,
            errMsg: "",
            pagination: {},
            delegatedTo: {},
            totalStaked: 0.0,
          };

          let total = 0.0;
          for (let i = 0; i < action.payload.delegations.length; i++) {
            const delegation = action.payload.delegations[i];
            result.delegatedTo[
              delegation?.delegation?.validator_address
            ] = true;
            total += parseFloat(delegation?.delegation?.shares);
          }
          result.totalStaked = total;
          state.chains[chainID].authzDelegations[granter] = result;
        }
      })
      .addCase(getAuthzDelegations.rejected, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        let granter = action.meta?.arg?.address;
        const result = {
          status: "rejected",
          delegations: [],
          errMsg: action.error.message,
          pagination: {},
          delegatedTo: {},
          totalStaked: 0.0,
        };
        state.chains[chainID].authzDelegations[granter] = result;
      });

    builder
      .addCase(getUnbonding.pending, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].unbonding.status = "pending";
        state.chains[chainID].unbonding.errMsg = "";
      })
      .addCase(getUnbonding.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].unbonding.status = "idle";
        state.chains[chainID].unbonding.delegations =
          action.payload.unbonding_responses;
        state.chains[chainID].unbonding.pagination = action.payload.pagination;
        state.chains[chainID].unbonding.errMsg = "";
      })
      .addCase(getUnbonding.rejected, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].unbonding.status = "rejected";
        state.chains[chainID].unbonding.errMsg = action.error.message;
      });

    builder
      .addCase(getParams.pending, (state) => {})
      .addCase(getParams.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].params = action.payload;
      })
      .addCase(getParams.rejected, (state, action) => {});

    builder
      .addCase(txDelegate.pending, (state, action) => {
        let chainID = action.meta?.arg?.chainId;
        state.chains[chainID].tx.status = "pending";
        state.chains[chainID].tx.type = "";
      })
      .addCase(txDelegate.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainId;
        state.chains[chainID].tx.status = "idle";
        state.chains[chainID].tx.type = "delegate";
      })
      .addCase(txDelegate.rejected, (state, action) => {
        let chainID = action.meta?.arg?.chainId;
        state.chains[chainID].tx.status = "rejected";
        state.chains[chainID].tx.type = "";
      });

    builder
      .addCase(txUnDelegate.pending, (state, action) => {
        let chainID = action.meta?.arg?.chainId;
        state.chains[chainID].tx.status = "pending";
        state.chains[chainID].tx.type = "";
      })
      .addCase(txUnDelegate.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainId;
        state.chains[chainID].tx.status = "idle";
        state.chains[chainID].tx.type = "undelegate";
      })
      .addCase(txUnDelegate.rejected, (state, action) => {
        let chainID = action.meta?.arg?.chainId;
        state.chains[chainID].tx.status = "rejected";
        state.chains[chainID].tx.type = "";
      });

    builder
      .addCase(txReDelegate.pending, (state, action) => {
        let chainID = action.meta?.arg?.chainId;
        state.chains[chainID].tx.status = "pending";
        state.chains[chainID].tx.type = "";
      })
      .addCase(txReDelegate.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainId;
        state.chains[chainID].tx.status = "idle";
        state.chains[chainID].tx.type = "redelegate";
      })
      .addCase(txReDelegate.rejected, (state, action) => {
        let chainID = action.meta?.arg?.chainId;
        state.chains[chainID].tx.status = "rejected";
        state.chains[chainID].tx.type = "";
      });

    // pool info
    builder
      .addCase(getPoolInfo.pending, (state) => {})
      .addCase(getPoolInfo.fulfilled, (state, action) => {
        let chainID = action.meta?.arg?.chainID;
        state.chains[chainID].pool[action.meta?.arg?.chainID] =
          action.payload.data;
      })
      .addCase(getPoolInfo.rejected, (state, action) => {});

    // restake transaction
    builder
      .addCase(txRestake.pending, (state) => {
        state.overviewTx.status = "pending";
      })
      .addCase(txRestake.fulfilled, (state) => {
        state.overviewTx.status = "idle";
      })
      .addCase(txRestake.rejected, (state) => {
        state.overviewTx.status = "rejected";
      });
  },
});

export const {
  resetState,
  sortValidatorsByVotingPower,
  resetDelegations,
  resetTxType,
  resetDefaultState,
  resetRestakeTx,
  addRewardsToDelegations,
} = stakeSlice.actions;

export default stakeSlice.reducer;
