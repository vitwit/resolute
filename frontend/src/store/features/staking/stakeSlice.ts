import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Delegate, UnDelegate, Redelegate } from '../../../txns/staking';
import stakingService from './stakingService';
import { ERR_UNKNOWN } from '../../../utils/errors';
import { signAndBroadcast } from '../../../utils/signing';
import cloneDeep from 'lodash/cloneDeep';
import { GAS_FEE } from '../../../utils/constants';
import {
  GetDelegationsResponse,
  GetUnbondingResponse,
  Pagination,
  Params,
  TxDelegateInputs,
  TxRedelegateInputs,
  TxReStakeInputs,
  TxUndelegateInputs,
  Validator,
} from '../../../types/staking';
import { AxiosError } from 'axios';
import { TxStatus } from '../../../types/enums';

interface Validators {
  status: TxStatus;
  active: { [key: string]: Validator };
  inactive: Record<string, Validator>;
  activeSorted: string[];
  inactiveSorted: string[];
  errMsg: string;
  pagination: {
    next_key: string | null;
  };
  totalActive: number;
  totalInactive: number;
  witvalValidator?: Validator;
}

interface Chain {
  validators: Validators;
  delegations: {
    status: TxStatus;
    delegations: GetDelegationsResponse;
    errMsg: string;
    pagination: Pagination | undefined;
    delegatedTo: Record<string, boolean>;
    totalStaked: number;
  };
  unbonding: {
    status: TxStatus;
    unbonding: GetUnbondingResponse;
    errMsg: string;
    pagination: Pagination | undefined;
  };

  params: Params | undefined;
  paramsStatus: TxStatus;
  tx: {
    status: TxStatus;
    type: string;
  };
  reStakeTxStatus: TxStatus;
}

interface Chains {
  [key: string]: Chain;
}

interface StakingState {
  chains: Chains;
  defaultState: Chain;
}

const initialState: StakingState = {
  chains: {},
  defaultState: {
    paramsStatus: TxStatus.INIT,
    validators: {
      status: TxStatus.INIT,
      active: {},
      inactive: {},
      activeSorted: [],
      inactiveSorted: [],
      errMsg: '',
      pagination: {
        next_key: null,
      },
      totalActive: 0,
      totalInactive: 0,
    },
    delegations: {
      status: TxStatus.INIT,
      delegations: {
        delegation_responses: [],
        pagination: {
          next_key: '',
          total: '',
        },
      },
      errMsg: '',
      pagination: undefined,
      delegatedTo: {},
      totalStaked: 0.0,
    },
    unbonding: {
      status: TxStatus.INIT,
      unbonding: {
        unbonding_responses: [],
        pagination: {
          next_key: '',
          total: '',
        },
      },
      errMsg: '',
      pagination: undefined,
    },
    params: undefined,
    tx: {
      status: TxStatus.INIT,
      type: '',
    },
    reStakeTxStatus: TxStatus.INIT,
  },
};

export const txRestake = createAsyncThunk(
  'staking/restake',
  async (data: TxReStakeInputs, { rejectWithValue, fulfillWithValue }) => {
    try {
      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.prefix,
        data.msgs,
        399999 + Math.ceil(399999 * 0.1 * (data.msgs?.length || 1)),
        data.memo,
        `${data.feeAmount}${data.denom}`,
        data.basicChainInfo.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response);
    }
  }
);

export const txDelegate = createAsyncThunk(
  'staking/delegate',
  async (
    data: TxDelegateInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const msg = Delegate(
        data.delegator,
        data.validator,
        data.amount,
        data.denom
      );

      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.prefix,
        [msg],
        860000,
        '',
        `${data.feeAmount}${data.denom}`,
        data.basicChainInfo.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        dispatch(resetDelegations({ chainID: data.basicChainInfo.chainID }));
        dispatch(
          getDelegations({
            baseURL: data.basicChainInfo.baseURL,
            address: data.delegator,
            chainID: data.basicChainInfo.chainID,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response);
    }
  }
);

export const txReDelegate = createAsyncThunk(
  'staking/redelegate',
  async (
    data: TxRedelegateInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const msg = Redelegate(
        data.delegator,
        data.srcVal,
        data.destVal,
        data.amount,
        data.denom
      );
      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.prefix,
        [msg],
        GAS_FEE,
        '',
        `${data.feeAmount}${data.denom}`,
        data.basicChainInfo.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        dispatch(resetDelegations({ chainID: data.basicChainInfo.chainID }));
        dispatch(
          getDelegations({
            baseURL: data.basicChainInfo.baseURL,
            address: data.delegator,
            chainID: data.basicChainInfo.chainID,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response);
    }
  }
);

export const txUnDelegate = createAsyncThunk(
  'staking/undelegate',
  async (data: TxUndelegateInputs, { rejectWithValue, fulfillWithValue }) => {
    try {
      const msg = UnDelegate(
        data.delegator,
        data.validator,
        data.amount,
        data.denom
      );
      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.prefix,
        [msg],
        860000,
        '',
        `${data.feeAmount}${data.denom}`,
        data.basicChainInfo.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.response);
    }
  }
);

export const getValidators = createAsyncThunk(
  'staking/validators',
  async (
    data: {
      baseURL: string;
      status?: string;
      pagination?: KeyLimitPagination;
      chainID: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await stakingService.validators(
        data.baseURL,
        data?.status,
        data?.pagination
      );
      return {
        chainID: data.chainID,
        data: response.data,
        pagination: data.pagination,
      };
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.message);
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const getAllValidators = createAsyncThunk(
  'staking/all-validators',
  async (
    data: {
      baseURL: string;
      status?: string;
      chainID: string;
    },
    { rejectWithValue }
  ) => {
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
        if (!response?.data?.pagination?.next_key) {
          break;
        }
        nextKey = response.data.pagination.next_key;
      }

      return {
        validators: validators,
        chainID: data.chainID,
      };
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.message);
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const getParams = createAsyncThunk(
  'staking/params',
  async (data: { baseURL: string; chainID: string }) => {
    const response = await stakingService.params(data.baseURL);
    return {
      data: response.data,
      chainID: data.chainID,
    };
  }
);

export const getDelegations = createAsyncThunk(
  'staking/delegations',
  async (
    data: {
      baseURL: string;
      address: string;
      chainID: string;
    },
    { rejectWithValue }
  ) => {
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
      if (error instanceof AxiosError) return rejectWithValue(error.message);
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const getUnbonding = createAsyncThunk(
  'staking/unbonding',
  async (
    data: { baseURL: string; address: string; chainID: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await stakingService.unbonding(
        data.baseURL,
        data.address
      );
      return {
        data: response.data,
        chainID: data.chainID,
      };
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.message);
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const stakeSlice = createSlice({
  name: 'staking',
  initialState,
  reducers: {
    resetRestakeTx: (state, action: PayloadAction<{ chainID: string }>) => {
      const chainID = action.payload.chainID;
      if (chainID?.length && state.chains[chainID]) {
        state.chains[chainID].reStakeTxStatus = TxStatus.INIT;
      }
    },
    resetTxType: (state, action: PayloadAction<{ chainID: string }>) => {
      const chainID = action.payload.chainID;
      state.chains[chainID].tx.type = '';
    },
    resetState: (state, action: PayloadAction<{ chainID: string }>) => {
      const { chainID } = action.payload;
      state.chains[chainID] = cloneDeep(initialState.defaultState);
    },
    resetDefaultState: (state, action: PayloadAction<string[]>) => {
      const chainsMap: Chains = {};
      const chains = action.payload;
      chains.map((chainID) => {
        chainsMap[chainID] = cloneDeep(initialState.defaultState);
      });
      state.chains = chainsMap;
    },
    resetDelegations: (state, action: PayloadAction<{ chainID: string }>) => {
      const { chainID } = action.payload;
      state.chains[chainID].delegations = initialState.defaultState.delegations;
    },
    sortValidatorsByVotingPower: (
      state,
      action: PayloadAction<{ chainID: string }>
    ) => {
      const chainID = action.payload.chainID;
      const activeSort = Object.fromEntries(
        Object.entries(state.chains[chainID].validators.active).sort(
          ([, a], [, b]) => {
            return parseInt(b.tokens) - parseInt(a.tokens);
          }
        )
      );

      state.chains[chainID].validators.activeSorted = Object.keys(activeSort);

      const inactiveSort = Object.fromEntries(
        Object.entries(state.chains[chainID].validators.inactive).sort(
          ([, a], [, b]) => {
            return parseInt(b.tokens) - parseInt(a.tokens);
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
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        state.chains[chainID].validators.status = TxStatus.PENDING;
        state.chains[chainID].validators.errMsg = '';
      })
      .addCase(getValidators.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validators.status = TxStatus.IDLE;
        const result: { validators: Validator[] } = { validators: [] };
        result.validators = action.payload.data.validators;
        const res = action.payload.data.validators;
        for (let index = 0; index < res.length; index++) {
          const element = res[index];
          if (
            element.status === 'BOND_STATUS_BONDED' &&
            !state.chains[chainID].validators.active[element.operator_address]
          ) {
            state.chains[chainID].validators.active[element.operator_address] =
              element;
            state.chains[chainID].validators.totalActive += 1;
            if (element?.description?.moniker === 'Witval') {
              state.chains[chainID].validators.witvalValidator = element;
            }
          } else if (
            element.status !== 'BOND_STATUS_BONDED' &&
            !state.chains[chainID].validators.inactive[element.operator_address]
          ) {
            state.chains[chainID].validators.inactive[
              element.operator_address
            ] = element;
            state.chains[chainID].validators.totalInactive += 1;
            if (element?.description?.moniker === 'Witval') {
              state.chains[chainID].validators.witvalValidator = element;
            }
          }
        }
        state.chains[chainID].validators.pagination =
          action.payload.data.pagination;
        state.chains[chainID].validators.errMsg = '';
      })
      .addCase(getValidators.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validators.status = TxStatus.REJECTED;
        state.chains[chainID].validators.errMsg =
          action.error.message || ERR_UNKNOWN;
        state.chains[chainID].validators.errMsg = action.error.message || '';
        state.chains[chainID].validators.status = TxStatus.REJECTED;
      });

    builder
      .addCase(getAllValidators.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        state.chains[chainID].validators.status = TxStatus.PENDING;
        state.chains[chainID].validators.errMsg = '';
      })
      .addCase(getAllValidators.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validators.status = TxStatus.IDLE;
        const validators = action.payload.validators;
        for (let index = 0; index < validators.length; index++) {
          const validator = validators[index];
          if (
            validator.status === 'BOND_STATUS_BONDED' &&
            !state.chains[chainID].validators.active[validator.operator_address]
          ) {
            state.chains[chainID].validators.active[
              validator.operator_address
            ] = validator;
            state.chains[chainID].validators.totalActive += 1;
            if (validator?.description?.moniker === 'Witval') {
              state.chains[chainID].validators.witvalValidator = validator;
            }
          } else if (
            validator.status !== 'BOND_STATUS_BONDED' &&
            !state.chains[chainID].validators.inactive[
              validator.operator_address
            ]
          ) {
            state.chains[chainID].validators.inactive[
              validator.operator_address
            ] = validator;
            state.chains[chainID].validators.totalInactive += 1;
            if (validator?.description?.moniker === 'Witval') {
              state.chains[chainID].validators.witvalValidator = validator;
            }
          }
        }
        state.chains[chainID].validators.errMsg = '';

        const activeSort = Object.fromEntries(
          Object.entries(state.chains[chainID].validators.active).sort(
            ([, a], [, b]) => {
              return parseInt(b.tokens) - parseInt(a.tokens);
            }
          )
        );

        state.chains[chainID].validators.activeSorted = Object.keys(activeSort);

        const inactiveSort = Object.fromEntries(
          Object.entries(state.chains[chainID].validators.inactive).sort(
            ([, a], [, b]) => {
              return parseInt(b.tokens) - parseInt(a.tokens);
            }
          )
        );
        state.chains[chainID].validators.inactiveSorted =
          Object.keys(inactiveSort);
      })
      .addCase(getAllValidators.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validators.errMsg = action.error.message || '';
        state.chains[chainID].validators.status = TxStatus.REJECTED;
      });

    builder
      .addCase(getDelegations.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        state.chains[chainID].delegations.status = TxStatus.PENDING;
        state.chains[chainID].delegations.errMsg = '';
      })
      .addCase(getDelegations.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (state.chains[chainID]) {
          state.chains[chainID].delegations.status = TxStatus.IDLE;
          state.chains[chainID].delegations.delegations.delegation_responses =
            action.payload.delegations;
          state.chains[chainID].delegations.errMsg = '';

          let total = 0.0;
          for (let i = 0; i < action.payload.delegations.length; i++) {
            const delegation = action.payload.delegations[i];
            state.chains[chainID].delegations.delegatedTo[
              delegation?.delegation?.validator_address
            ] = true;
            total += parseFloat(delegation?.delegation?.shares);
          }
          state.chains[chainID].delegations.totalStaked = total;
        }
      })
      .addCase(getDelegations.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (state.chains[chainID]) {
          state.chains[chainID].delegations.status = TxStatus.REJECTED;
          state.chains[chainID].delegations.errMsg = action.error.message || '';
        }
      });

    builder
      .addCase(getParams.pending, (state, action) => {
        const { chainID } = action.meta.arg;
        state.chains[chainID].paramsStatus = TxStatus.PENDING;
      })
      .addCase(getParams.fulfilled, (state, action) => {
        const { chainID } = action.meta.arg;
        state.chains[chainID].paramsStatus = TxStatus.IDLE;
        state.chains[chainID].params = action.payload.data.params;
      })
      .addCase(getParams.rejected, (state, action) => {
        const { chainID } = action.meta.arg;
        state.chains[chainID].paramsStatus = TxStatus.REJECTED;
      });

    builder
      .addCase(getUnbonding.pending, (state, action) => {
        const { chainID } = action.meta.arg;
        state.chains[chainID].unbonding.status = TxStatus.PENDING;
        state.chains[chainID].unbonding.errMsg = '';
      })
      .addCase(getUnbonding.fulfilled, (state, action) => {
        const { chainID } = action.meta.arg;
        state.chains[chainID].unbonding.status = TxStatus.IDLE;
        state.chains[chainID].unbonding.unbonding.unbonding_responses =
          action.payload.data.unbonding_responses;
        state.chains[chainID].unbonding.pagination =
          action.payload.data.pagination;
        state.chains[chainID].unbonding.errMsg = '';
      })
      .addCase(getUnbonding.rejected, (state, action) => {
        const { chainID } = action.meta.arg;
        state.chains[chainID].unbonding.status = TxStatus.REJECTED;
        state.chains[chainID].unbonding.errMsg = action.error.message || '';
      });

    builder
      .addCase(txDelegate.pending, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.type = 'delegate';
      })
      .addCase(txDelegate.fulfilled, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.IDLE;
        state.chains[chainID].tx.type = 'delegate';
      })
      .addCase(txDelegate.rejected, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.REJECTED;
        state.chains[chainID].tx.type = 'delegate';
      });

    builder
      .addCase(txUnDelegate.pending, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.type = 'undelegate';
      })
      .addCase(txUnDelegate.fulfilled, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.IDLE;
        state.chains[chainID].tx.type = 'undelegate';
      })
      .addCase(txUnDelegate.rejected, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.REJECTED;
        state.chains[chainID].tx.type = 'undelegate';
      });

    builder
      .addCase(txReDelegate.pending, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.type = 'redelegate';
      })
      .addCase(txReDelegate.fulfilled, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.IDLE;
        state.chains[chainID].tx.type = 'redelegate';
      })
      .addCase(txReDelegate.rejected, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].tx.status = TxStatus.REJECTED;
        state.chains[chainID].tx.type = 'redelegate';
      });

    // restake transaction
    builder
      .addCase(txRestake.pending, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].reStakeTxStatus = TxStatus.PENDING;
      })
      .addCase(txRestake.fulfilled, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].reStakeTxStatus = TxStatus.IDLE;
      })
      .addCase(txRestake.rejected, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].reStakeTxStatus = TxStatus.REJECTED;
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
} = stakeSlice.actions;

export default stakeSlice.reducer;
