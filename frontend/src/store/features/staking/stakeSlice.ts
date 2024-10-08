'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Delegate, UnDelegate, Redelegate } from '../../../txns/staking';
import stakingService from './stakingService';
import { ERR_UNKNOWN } from '../../../utils/errors';
import { signAndBroadcast } from '../../../utils/signing';
import cloneDeep from 'lodash/cloneDeep';
import { FAILED, GAS_FEE, SUCCESS } from '../../../utils/constants';
import {
  GetDelegationsResponse,
  GetUnbondingResponse,
  Pagination,
  Params,
  TxCancelUnbondingInputs,
  TxDelegateInputs,
  TxRedelegateInputs,
  TxReStakeInputs,
  TxUndelegateInputs,
  Validator,
  Validators,
} from '../../../types/staking';
import { AxiosError } from 'axios';
import { TxStatus } from '../../../types/enums';
import { NewTransaction } from '@/utils/transaction';
import { setError, setTxAndHash } from '../common/commonSlice';
import { Unbonding } from '@/txns/staking/unbonding';
import {
  getAuthzDelegatorTotalRewards,
  getDelegatorTotalRewards,
} from '../distribution/distributionSlice';
import { getAuthzBalances, getBalances } from '../bank/bankSlice';
import { trackEvent } from '@/utils/util';

interface Chain {
  validators: Validators;
  delegations: {
    status: TxStatus;
    delegations: GetDelegationsResponse;
    hasDelegations: boolean;
    errMsg: string;
    pagination: Pagination | undefined;
    delegatedTo: Record<string, boolean>;
    totalStaked: number;
  };
  unbonding: {
    status: TxStatus;
    unbonding: GetUnbondingResponse;
    hasUnbonding: boolean;
    errMsg: string;
    pagination: Pagination | undefined;
    totalUnbonded: number;
  };
  validator: {
    [key: string]: Validator | undefined | TxStatus | string;
    validatorInfo: Validator | undefined;
    status: TxStatus;
    errMsg: string;
  };
  params: Params | undefined;
  paramsStatus: TxStatus;
  tx: {
    status: TxStatus;
    type: string;
  };
  pool: {
    not_bonded_tokens: string;
    bonded_tokens: string;
  };
  poolStatus: TxStatus;
  reStakeTxStatus: TxStatus;
  cancelUnbondingTxStatus: TxStatus;
  isTxAll: boolean;
  validatorProfiles: Record<string, { totalDelegators: number }>;
}

export interface Chains {
  [key: string]: Chain;
}

interface StakingState {
  validatorsLoading: number;
  delegationsLoading: number;
  undelegationsLoading: number;
  totalUndelegationsAmount: number;
  chains: Chains;
  hasDelegations: boolean;
  hasUnbonding: boolean;
  defaultState: Chain;
  authz: {
    delegationsLoading: number;
    chains: Chains;
    hasDelegations: boolean;
    hasUnbonding: boolean;
    undelegationsLoading: number;
    totalUndelegationsAmount: number;
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  witvalNonCosmosValidators: {
    chains: Record<string, any>;
    delegators: Record<string, any>;
  };
  allValidators: Record<string, any>;
  filteredValidators: Record<string, any>;
  searchQuery: string;
}

const initialState: StakingState = {
  chains: {},
  validatorsLoading: 0,
  delegationsLoading: 0,
  undelegationsLoading: 0,
  totalUndelegationsAmount: 0,
  hasUnbonding: false,
  hasDelegations: false,
  authz: {
    chains: {},
    delegationsLoading: 0,
    hasUnbonding: false,
    hasDelegations: false,
    undelegationsLoading: 0,
    totalUndelegationsAmount: 0,
  },
  witvalNonCosmosValidators: {
    chains: {},
    delegators: {},
  },
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
    validatorProfiles: {},
    delegations: {
      status: TxStatus.INIT,
      delegations: {
        delegation_responses: [],
        pagination: {
          next_key: '',
          total: '',
        },
      },
      hasDelegations: false,
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
      hasUnbonding: false,
      errMsg: '',
      pagination: undefined,
      totalUnbonded: 0.0,
    },
    validator: {
      validatorInfo: undefined,
      errMsg: '',
      status: TxStatus.INIT,
    },
    pool: {
      not_bonded_tokens: '0',
      bonded_tokens: '0',
    },
    poolStatus: TxStatus.INIT,
    params: undefined,
    tx: {
      status: TxStatus.INIT,
      type: '',
    },
    reStakeTxStatus: TxStatus.INIT,
    cancelUnbondingTxStatus: TxStatus.INIT,
    isTxAll: false,
  },
  allValidators: {},
  filteredValidators: {},
  searchQuery: '',
};

export const txRestake = createAsyncThunk(
  'staking/restake',
  async (
    data: TxReStakeInputs | TxAuthzExecInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    const { chainID, address, rest, aminoConfig, prefix } = data.basicChainInfo;
    try {
      const result = await signAndBroadcast(
        chainID,
        aminoConfig,
        prefix,
        data.msgs,
        399999 + Math.ceil(399999 * 0.1 * (data.msgs?.length || 1)),
        data.memo,
        `${data.basicChainInfo.feeAmount * 10 ** data.basicChainInfo.decimals}${
          data.denom
        }`,
        rest,
        data?.feegranter?.length ? data.feegranter : undefined,
        data?.basicChainInfo?.rpc,
        data?.basicChainInfo?.restURLs
      );
      const tx = NewTransaction(result, data.msgs, chainID, address);
      dispatch(
        setTxAndHash({
          tx,
          hash: tx.transactionHash,
        })
      );
      if (result?.code === 0) {
        trackEvent('STAKING', 'RESTAKE', SUCCESS);
        if (data.isAuthzMode) {
          dispatch(
            getAuthzDelegatorTotalRewards({
              baseURLs: data.basicChainInfo.restURLs,
              baseURL: rest,
              address: data.authzChainGranter,
              chainID: chainID,
              denom: data.denom,
            })
          );
          dispatch(
            getAuthzDelegations({
              baseURLs: data.basicChainInfo.restURLs,
              address: data.authzChainGranter,
              chainID: chainID,
            })
          );
        } else {
          dispatch(
            getDelegatorTotalRewards({
              baseURLs: data.basicChainInfo.restURLs,
              baseURL: rest,
              address: address,
              chainID: chainID,
              denom: data.denom,
            })
          );
          dispatch(
            getDelegations({
              baseURLs: data.basicChainInfo.restURLs,
              address: address,
              chainID: chainID,
            })
          );
        }
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        trackEvent('STAKING', 'RESTAKE', FAILED);
        return rejectWithValue(result?.rawLog);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      trackEvent('STAKING', 'RESTAKE', FAILED);
      const errMessage = error?.response?.data?.error || error?.message;
      dispatch(
        setError({
          type: 'error',
          message: errMessage || ERR_UNKNOWN,
        })
      );
      return rejectWithValue(errMessage || ERR_UNKNOWN);
    }
  }
);

export const txDelegate = createAsyncThunk(
  'staking/delegate',
  async (
    data: TxDelegateInputs | TxAuthzExecInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      let msgs: Msg[];
      if (data.isAuthzMode) {
        msgs = data.msgs;
      } else {
        msgs = [
          Delegate(data.delegator, data.validator, data.amount, data.denom),
        ];
      }

      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        msgs,
        GAS_FEE,
        '',
        `${data.basicChainInfo.feeAmount * 10 ** data.basicChainInfo.decimals}${
          data.denom
        }`,
        data.basicChainInfo.rest,
        data?.feegranter?.length ? data.feegranter : undefined,
        data?.basicChainInfo?.rpc,
        data?.basicChainInfo?.restURLs
      );
      const tx = NewTransaction(
        result,
        msgs,
        data.basicChainInfo.chainID,
        data.basicChainInfo.address
      );

      dispatch(
        setTxAndHash({
          tx,
          hash: tx.transactionHash,
        })
      );

      if (result?.code === 0) {
        if (data.isAuthzMode) {
          dispatch(
            resetAuthzDelegations({ chainID: data.basicChainInfo.chainID })
          );
          dispatch(
            getAuthzDelegations({
              baseURLs: data.basicChainInfo.restURLs,
              address: data.authzChainGranter,
              chainID: data.basicChainInfo.chainID,
            })
          );
          dispatch(
            getAuthzBalances({
              baseURLs: data.basicChainInfo.restURLs,
              baseURL: data.basicChainInfo.baseURL,
              chainID: data.basicChainInfo.chainID,
              address: data.authzChainGranter,
            })
          );
        } else {
          dispatch(resetDelegations({ chainID: data.basicChainInfo.chainID }));
          dispatch(
            getDelegations({
              baseURLs: data.basicChainInfo.restURLs,
              address: data.delegator,
              chainID: data.basicChainInfo.chainID,
            })
          );
          dispatch(
            getBalances({
              baseURLs: data.basicChainInfo.restURLs,
              baseURL: data.basicChainInfo.baseURL,
              chainID: data.basicChainInfo.chainID,
              address: data.delegator,
            })
          );
        }

        trackEvent('STAKING', 'DELEGATE', SUCCESS);

        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        trackEvent('STAKING', 'DELEGATE', FAILED);
        return rejectWithValue(result?.rawLog);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      trackEvent('STAKING', 'DELEGATE', FAILED);
      const errMessage = error?.response?.data?.error || error?.message;
      dispatch(
        setError({
          type: 'error',
          message: errMessage || ERR_UNKNOWN,
        })
      );
      return rejectWithValue(errMessage || ERR_UNKNOWN);
    }
  }
);

export const txReDelegate = createAsyncThunk(
  'staking/redelegate',
  async (
    data: TxRedelegateInputs | TxAuthzExecInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      let msgs: Msg[];
      if (data.isAuthzMode) {
        msgs = data.msgs;
      } else {
        msgs = [
          Redelegate(
            data.delegator,
            data.srcVal,
            data.destVal,
            data.amount,
            data.denom
          ),
        ];
      }

      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        msgs,
        GAS_FEE,
        '',
        `${data.basicChainInfo.feeAmount * 10 ** data.basicChainInfo.decimals}${
          data.denom
        }`,
        data.basicChainInfo.rest,
        data?.feegranter?.length ? data.feegranter : undefined,
        data?.basicChainInfo?.rpc,
        data?.basicChainInfo?.restURLs
      );

      const tx = NewTransaction(
        result,
        msgs,
        data.basicChainInfo.chainID,
        data.basicChainInfo.address
      );

      dispatch(
        setTxAndHash({
          tx,
          hash: tx.transactionHash,
        })
      );

      if (result?.code === 0) {
        if (data.isAuthzMode) {
          dispatch(
            resetAuthzDelegations({ chainID: data.basicChainInfo.chainID })
          );
          dispatch(
            getAuthzDelegations({
              baseURLs: data.basicChainInfo.restURLs,
              address: data.authzChainGranter,
              chainID: data.basicChainInfo.chainID,
            })
          );
        } else {
          dispatch(resetDelegations({ chainID: data.basicChainInfo.chainID }));
          dispatch(
            getDelegations({
              baseURLs: data.basicChainInfo.restURLs,
              address: data.delegator,
              chainID: data.basicChainInfo.chainID,
            })
          );
        }

        trackEvent('STAKING', 'REDELEGATE', SUCCESS);

        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        trackEvent('STAKING', 'REDELEGATE', FAILED);

        return rejectWithValue(result?.rawLog);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      trackEvent('STAKING', 'REDELEGATE', FAILED);
      const errMessage = error?.response?.data?.error || error?.message;
      dispatch(
        setError({
          type: 'error',
          message: errMessage || ERR_UNKNOWN,
        })
      );
      return rejectWithValue(errMessage || ERR_UNKNOWN);
    }
  }
);

export const txUnDelegate = createAsyncThunk(
  'staking/undelegate',
  async (
    data: TxUndelegateInputs | TxAuthzExecInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      let msgs: Msg[];
      if (data.isAuthzMode) {
        msgs = data.msgs;
      } else {
        msgs = [
          UnDelegate(data.delegator, data.validator, data.amount, data.denom),
        ];
      }

      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        msgs,
        GAS_FEE,
        '',
        `${data.basicChainInfo.feeAmount * 10 ** data.basicChainInfo.decimals}${
          data.denom
        }`,
        data.basicChainInfo.rest,
        data?.feegranter?.length ? data.feegranter : undefined,
        data?.basicChainInfo?.rpc,
        data?.basicChainInfo?.restURLs
      );

      const tx = NewTransaction(
        result,
        msgs,
        data.basicChainInfo.chainID,
        data.basicChainInfo.address
      );

      dispatch(
        setTxAndHash({
          tx,
          hash: tx.transactionHash,
        })
      );

      if (result?.code === 0) {
        if (data.isAuthzMode) {
          dispatch(
            getAuthzDelegations({
              baseURLs: data.basicChainInfo.restURLs,
              address: data.authzChainGranter,
              chainID: data.basicChainInfo.chainID,
            })
          );
          dispatch(
            getAuthzUnbonding({
              baseURLs: data.basicChainInfo.restURLs,
              address: data.authzChainGranter,
              chainID: data.basicChainInfo.chainID,
            })
          );
        } else {
          dispatch(
            getDelegations({
              baseURLs: data.basicChainInfo.restURLs,
              address: data.basicChainInfo.address,
              chainID: data.basicChainInfo.chainID,
            })
          );
          dispatch(
            getUnbonding({
              baseURLs: data.basicChainInfo.restURLs,
              address: data.basicChainInfo.address,
              chainID: data.basicChainInfo.chainID,
            })
          );
        }

        trackEvent('STAKING', 'UNDELEGATE', SUCCESS);

        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        trackEvent('STAKING', 'UNDELEGATE', FAILED);

        return rejectWithValue(result?.rawLog);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      trackEvent('STAKING', 'UNDELEGATE', FAILED);
      const errMessage = error?.response?.data?.error || error?.message;
      dispatch(
        setError({
          type: 'error',
          message: errMessage || ERR_UNKNOWN,
        })
      );
      return rejectWithValue(errMessage || ERR_UNKNOWN);
    }
  }
);

export const txCancelUnbonding = createAsyncThunk(
  'staking/cancel-unbonding',
  async (
    data: TxCancelUnbondingInputs | TxAuthzExecInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      let msgs: Msg[];
      if (data.isAuthzMode) {
        msgs = data.msgs;
      } else {
        const msg = Unbonding(
          data.delegator,
          data.validator,
          data.amount,
          data.denom,
          data.creationHeight
        );
        msg.value.creationHeight = msg.value.creationHeight.toString();
        msgs = [msg];
      }

      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.basicChainInfo.prefix,
        msgs,
        GAS_FEE,
        '',
        `${data.basicChainInfo.feeAmount * 10 ** data.basicChainInfo.decimals}${
          data.denom
        }`,
        data.basicChainInfo.rest,
        data?.feegranter?.length ? data.feegranter : undefined,
        data?.basicChainInfo?.rpc,
        data?.basicChainInfo?.restURLs
      );
      const tx = NewTransaction(
        result,
        msgs,
        data.basicChainInfo.chainID,
        data.basicChainInfo.address
      );

      dispatch(
        setTxAndHash({
          tx,
          hash: tx.transactionHash,
        })
      );

      if (result?.code === 0) {
        if (data.isAuthzMode) {
          const inputData = {
            baseURLs: data.basicChainInfo.restURLs,
            address: data.authzChainGranter,
            chainID: data.basicChainInfo.chainID,
          };
          dispatch(
            resetAuthzDelegations({ chainID: data.basicChainInfo.chainID })
          );
          dispatch(getAuthzDelegations(inputData));
          dispatch(getAuthzUnbonding(inputData));
        } else {
          const inputData = {
            baseURLs: data.basicChainInfo.restURLs,
            address: data.delegator,
            chainID: data.basicChainInfo.chainID,
          };
          dispatch(resetDelegations({ chainID: data.basicChainInfo.chainID }));
          dispatch(getDelegations(inputData));
          dispatch(getUnbonding(inputData));
        }

        trackEvent('STAKING', 'CANCEL_UNBONDING', SUCCESS);

        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        trackEvent('STAKING', 'CANCEL_UNBONDING', FAILED);

        return rejectWithValue(result?.rawLog);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      trackEvent('STAKING', 'CANCEL_UNBONDING', FAILED);
      const errMessage = error?.response?.data?.error || error?.message;
      dispatch(
        setError({
          type: 'error',
          message: errMessage || ERR_UNKNOWN,
        })
      );
      return rejectWithValue(errMessage || ERR_UNKNOWN);
    }
  }
);

export const getValidators = createAsyncThunk(
  'staking/validators',
  async (
    data: {
      baseURLs: string[];
      status?: string;
      pagination?: KeyLimitPagination;
      chainID: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await stakingService.validators(
        data.baseURLs,
        data.chainID,
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
      baseURLs: string[];
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
          data.baseURLs,
          data.chainID,
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

export const getPoolInfo = createAsyncThunk(
  'staking/poolInfo',
  async (data: { baseURLs: string[]; chainID: string }) => {
    const response = await stakingService.poolInfo(data.baseURLs, data.chainID);
    return {
      chainID: data.chainID,
      data: response.data,
    };
  }
);

export const getParams = createAsyncThunk(
  'staking/params',
  async (data: { baseURLs: string[]; chainID: string }) => {
    const response = await stakingService.params(data.baseURLs, data.chainID);
    return {
      data: response.data,
      chainID: data.chainID,
    };
  }
);

export const getTotalDelegationsCount = createAsyncThunk(
  'staking/total-delegations-count',
  async (data: {
    baseURLs: string[];
    chainID: string;
    operatorAddress: string;
  }) => {
    const response = await stakingService.validatorDelegations(
      data.baseURLs,
      data.operatorAddress,
      data.chainID
    );
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
      baseURLs: string[];
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
          data.baseURLs,
          data.address,
          data.chainID,
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

export const getAuthzDelegations = createAsyncThunk(
  'staking/authz-delegations',
  async (
    data: {
      baseURLs: string[];
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
          data.baseURLs,
          data.address,
          data.chainID,
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
    data: { baseURLs: string[]; address: string; chainID: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await stakingService.unbonding(
        data.baseURLs,
        data.address,
        data.chainID
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

export const getAuthzUnbonding = createAsyncThunk(
  'staking/authz-unbonding',
  async (
    data: { baseURLs: string[]; address: string; chainID: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await stakingService.unbonding(
        data.baseURLs,
        data.address,
        data.chainID
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

export const getValidator = createAsyncThunk(
  'staking/get-validator',
  async (
    data: {
      baseURLs: string[];
      chainID: string;
      valoperAddress: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await stakingService.validatorInfo(
        data.baseURLs,
        data.valoperAddress,
        data.chainID
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

export const getAuthzValidator = createAsyncThunk(
  'staking/get-authz-validator',
  async (
    data: {
      baseURLs: string[];
      chainID: string;
      valoperAddress: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await stakingService.validatorInfo(
        data.baseURLs,
        data.valoperAddress,
        data.chainID
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

export const getWitvalPolygonValidator = createAsyncThunk(
  'staking/get-polygon-witval',
  async (
    data: {
      baseURL: string;
      id: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await stakingService.polygonValidator(
        data.baseURL,
        data.id
      );
      return {
        data: response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.message);
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const getWitvalPolygonDelegatorsCount = createAsyncThunk(
  'staking/get-polygon-witval-delegators',
  async (
    data: {
      baseURL: string;
      id: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await stakingService.polygonDelegators(
        data.baseURL,
        data.id
      );
      return {
        data: response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.message);
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const getWitvalOasisDelegations = createAsyncThunk(
  'staking/get-oasis-witval-delegations',
  async (
    data: {
      baseURL: string;
      operatorAddress: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await stakingService.oasisDelegations(
        data.baseURL,
        data.operatorAddress
      );
      return {
        data: response.data,
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
    setValidators(state, action: PayloadAction<Record<string, Validator>>) {
      state.allValidators = action.payload;
      state.filteredValidators = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    filterValidators(state) {
      const query = state.searchQuery.toLowerCase();
      state.filteredValidators = Object.fromEntries(
        Object.entries(state.allValidators).filter(
          ([, validator]) =>
            validator.operator_address.toLowerCase().includes(query) ||
            validator.description?.moniker.toLowerCase().includes(query)
        )
      );
    },
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
    resetCompleteState: (state) => {
      /* eslint-disable-next-line */
      state = cloneDeep(initialState);
    },
    resetAuthz: (state) => {
      state.authz = {
        chains: {},
        delegationsLoading: 0,
        hasUnbonding: false,
        hasDelegations: false,
        undelegationsLoading: 0,
        totalUndelegationsAmount: 0,
      };
    },
    resetCancelUnbondingTx: (
      state,
      action: PayloadAction<{ chainID: string }>
    ) => {
      const { chainID } = action.payload;
      state.chains[chainID].cancelUnbondingTxStatus = cloneDeep(
        initialState.defaultState.cancelUnbondingTxStatus
      );
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
    resetAuthzDelegations: (
      state,
      action: PayloadAction<{ chainID: string }>
    ) => {
      const { chainID } = action.payload;
      state.authz.chains[chainID].delegations =
        initialState.defaultState.delegations;
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
        state.validatorsLoading++;
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        state.chains[chainID].validators.status = TxStatus.PENDING;
        state.chains[chainID].validators.errMsg = '';
      })
      .addCase(getValidators.fulfilled, (state, action) => {
        state.validatorsLoading--;
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
        state.validatorsLoading--;
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validators.status = TxStatus.REJECTED;
        state.chains[chainID].validators.errMsg =
          action.error.message || ERR_UNKNOWN;
        state.chains[chainID].validators.errMsg = action.error.message || '';
        state.chains[chainID].validators.status = TxStatus.REJECTED;
      });

    builder
      .addCase(getAllValidators.pending, (state, action) => {
        state.validatorsLoading++;
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        state.chains[chainID].validators.status = TxStatus.PENDING;
        state.chains[chainID].validators.errMsg = '';
      })
      .addCase(getAllValidators.fulfilled, (state, action) => {
        state.validatorsLoading--;
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
        state.validatorsLoading--;
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validators.errMsg = action.error.message || '';
        state.chains[chainID].validators.status = TxStatus.REJECTED;
      });

    builder
      .addCase(getDelegations.pending, (state, action) => {
        state.delegationsLoading++;
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        state.chains[chainID].delegations.status = TxStatus.PENDING;
        state.chains[chainID].delegations.errMsg = '';
      })
      .addCase(getDelegations.fulfilled, (state, action) => {
        state.delegationsLoading--;
        const chainID = action.meta?.arg?.chainID;
        if (state.chains[chainID]) {
          const delegation_responses = action.payload.delegations;
          if (delegation_responses?.length) {
            state.chains[chainID].delegations.hasDelegations = true;
            state.hasDelegations = true;
          }
          state.chains[chainID].delegations.status = TxStatus.IDLE;
          state.chains[chainID].delegations.delegations.delegation_responses =
            delegation_responses;
          state.chains[chainID].delegations.errMsg = '';

          let total = 0.0;
          for (let i = 0; i < delegation_responses.length; i++) {
            const delegation = delegation_responses[i];
            state.chains[chainID].delegations.delegatedTo[
              delegation?.delegation?.validator_address
            ] = true;
            total += parseFloat(delegation?.delegation?.shares);
          }
          state.chains[chainID].delegations.totalStaked = total;
        }
      })
      .addCase(getDelegations.rejected, (state, action) => {
        state.delegationsLoading--;
        const chainID = action.meta?.arg?.chainID;
        if (state.chains[chainID]) {
          state.chains[chainID].delegations.status = TxStatus.REJECTED;
          state.chains[chainID].delegations.errMsg = action.error.message || '';
        }
      });

    builder
      .addCase(getAuthzDelegations.pending, (state, action) => {
        state.authz.delegationsLoading++;
        const chainID = action.meta?.arg?.chainID;
        if (!state.authz.chains[chainID])
          state.authz.chains[chainID] = cloneDeep(initialState.defaultState);
        state.authz.chains[chainID].delegations.status = TxStatus.PENDING;
        state.authz.chains[chainID].delegations.errMsg = '';
      })
      .addCase(getAuthzDelegations.fulfilled, (state, action) => {
        state.authz.delegationsLoading--;
        const chainID = action.meta?.arg?.chainID;
        if (state.authz.chains[chainID]) {
          const delegation_responses = action.payload.delegations;
          if (delegation_responses?.length) {
            state.authz.chains[chainID].delegations.hasDelegations = true;
            state.authz.hasDelegations = true;
          }
          state.authz.chains[chainID].delegations.status = TxStatus.IDLE;
          state.authz.chains[
            chainID
          ].delegations.delegations.delegation_responses = delegation_responses;
          state.authz.chains[chainID].delegations.errMsg = '';

          let total = 0.0;
          for (let i = 0; i < delegation_responses.length; i++) {
            const delegation = delegation_responses[i];
            state.authz.chains[chainID].delegations.delegatedTo[
              delegation?.delegation?.validator_address
            ] = true;
            total += parseFloat(delegation?.delegation?.shares);
          }
          state.authz.chains[chainID].delegations.totalStaked = total;
        }
      })
      .addCase(getAuthzDelegations.rejected, (state, action) => {
        state.authz.delegationsLoading--;
        const chainID = action.meta?.arg?.chainID;
        if (state.authz.chains[chainID]) {
          state.authz.chains[chainID].delegations.status = TxStatus.REJECTED;
          state.authz.chains[chainID].delegations.errMsg =
            action.error.message || '';
        }
      });

    builder
      .addCase(getPoolInfo.pending, (state, action) => {
        const { chainID } = action.meta.arg;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        state.chains[chainID].poolStatus = TxStatus.PENDING;
      })
      .addCase(getPoolInfo.fulfilled, (state, action) => {
        const { chainID } = action.meta.arg;
        state.chains[chainID].poolStatus = TxStatus.IDLE;
        state.chains[chainID].pool = action.payload.data.pool;
      })
      .addCase(getPoolInfo.rejected, (state, action) => {
        const { chainID } = action.meta.arg;
        state.chains[chainID].poolStatus = TxStatus.REJECTED;
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
        state.undelegationsLoading++;
        const { chainID } = action.meta.arg;
        state.chains[chainID].unbonding.status = TxStatus.PENDING;
        state.chains[chainID].unbonding.errMsg = '';
      })
      .addCase(getUnbonding.fulfilled, (state, action) => {
        state.undelegationsLoading--;
        const { chainID } = action.meta.arg;
        const unbonding_responses = action.payload.data.unbonding_responses;
        let totalUnbonded = 0.0;
        if (unbonding_responses?.length) {
          unbonding_responses.forEach((unbondingEntries) => {
            unbondingEntries.entries.forEach((unbondingEntry) => {
              totalUnbonded += +unbondingEntry.balance;
            });
          });
          state.chains[chainID].unbonding.totalUnbonded = totalUnbonded;
          state.totalUndelegationsAmount += totalUnbonded;
          if (unbonding_responses[0].entries.length) {
            state.chains[chainID].unbonding.hasUnbonding = true;
            state.hasUnbonding = true;
          }
        }
        state.chains[chainID].unbonding.status = TxStatus.IDLE;
        state.chains[chainID].unbonding.unbonding.unbonding_responses =
          unbonding_responses;
        state.chains[chainID].unbonding.pagination =
          action.payload.data.pagination;
        state.chains[chainID].unbonding.errMsg = '';
      })
      .addCase(getUnbonding.rejected, (state, action) => {
        state.undelegationsLoading--;
        const { chainID } = action.meta.arg;
        state.chains[chainID].unbonding.status = TxStatus.REJECTED;
        state.chains[chainID].unbonding.errMsg = action.error.message || '';
      });

    builder
      .addCase(getAuthzUnbonding.pending, (state, action) => {
        state.authz.undelegationsLoading++;
        const { chainID } = action.meta.arg;
        if (!state.authz.chains[chainID])
          state.authz.chains[chainID] = cloneDeep(state.defaultState);
        state.authz.chains[chainID].unbonding.status = TxStatus.PENDING;
        state.authz.chains[chainID].unbonding.errMsg = '';
      })
      .addCase(getAuthzUnbonding.fulfilled, (state, action) => {
        state.authz.undelegationsLoading--;
        const { chainID } = action.meta.arg;
        const unbonding_responses = action.payload.data.unbonding_responses;
        let totalUnbonded = 0.0;
        if (unbonding_responses?.length) {
          unbonding_responses.forEach((unbondingEntries) => {
            unbondingEntries.entries.forEach((unbondingEntry) => {
              totalUnbonded += +unbondingEntry.balance;
            });
          });
          state.authz.chains[chainID].unbonding.totalUnbonded = totalUnbonded;
          state.authz.totalUndelegationsAmount += totalUnbonded;
          if (unbonding_responses[0].entries.length) {
            state.authz.chains[chainID].unbonding.hasUnbonding = true;
            state.authz.hasUnbonding = true;
          }
        }
        state.authz.chains[chainID].unbonding.status = TxStatus.IDLE;
        state.authz.chains[chainID].unbonding.unbonding.unbonding_responses =
          unbonding_responses;
        state.authz.chains[chainID].unbonding.pagination =
          action.payload.data.pagination;
        state.authz.chains[chainID].unbonding.errMsg = '';
      })
      .addCase(getAuthzUnbonding.rejected, (state, action) => {
        state.authz.undelegationsLoading--;
        const { chainID } = action.meta.arg;
        state.authz.chains[chainID].unbonding.status = TxStatus.REJECTED;
        state.authz.chains[chainID].unbonding.errMsg =
          action.error.message || '';
      });

    builder
      .addCase(getValidator.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        state.chains[chainID].validator.status = TxStatus.PENDING;
        const valoperAddress = action.meta?.arg?.valoperAddress;
        state.chains[chainID].validator[valoperAddress] = TxStatus.PENDING;
        state.chains[chainID].validator.errMsg = '';
      })
      .addCase(getValidator.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validator.status = TxStatus.IDLE;
        state.chains[chainID].validator.validatorInfo =
          action.payload.data.validator;

        const valoperAddress = action.meta?.arg?.valoperAddress;
        state.chains[chainID].validator[valoperAddress] =
          action?.payload?.data?.validator;
      })
      .addCase(getValidator.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].validator.status = TxStatus.REJECTED;
        state.chains[chainID].validator.errMsg = '';
        const valoperAddress = action.meta?.arg?.valoperAddress;
        state.chains[chainID].validator[valoperAddress] = TxStatus.REJECTED;
      });

    builder
      .addCase(getAuthzValidator.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (!state.authz.chains[chainID])
          state.authz.chains[chainID] = cloneDeep(initialState.defaultState);
        state.authz.chains[chainID].validator.status = TxStatus.PENDING;
        state.authz.chains[chainID].validator.errMsg = '';
      })
      .addCase(getAuthzValidator.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.authz.chains[chainID].validator.status = TxStatus.IDLE;
        state.authz.chains[chainID].validator.validatorInfo =
          action.payload.data.validator;
      })
      .addCase(getAuthzValidator.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.authz.chains[chainID].validator.status = TxStatus.REJECTED;
        state.authz.chains[chainID].validator.errMsg = '';
      });

    builder
      .addCase(getTotalDelegationsCount.pending, (state, action) => {
        const { chainID, operatorAddress } = action.meta.arg;
        state.chains[chainID].validatorProfiles = {
          ...state.chains[chainID].validatorProfiles,
          [operatorAddress]: { totalDelegators: 0 },
        };
      })
      .addCase(getTotalDelegationsCount.fulfilled, (state, action) => {
        const { chainID, operatorAddress } = action.meta.arg;
        state.chains[chainID].validatorProfiles = {
          ...state.chains[chainID].validatorProfiles,
          [operatorAddress]: {
            totalDelegators: action.payload?.data?.pagination?.total || 0,
          },
        };
      })
      .addCase(getTotalDelegationsCount.rejected, () => {});

    builder
      .addCase(getWitvalPolygonValidator.pending, () => {})
      .addCase(getWitvalPolygonValidator.fulfilled, (state, action) => {
        state.witvalNonCosmosValidators.chains = {
          ...state.witvalNonCosmosValidators.chains,
          polygon: action.payload.data,
        };
      })
      .addCase(getWitvalPolygonValidator.rejected, () => {});

    builder
      .addCase(getWitvalPolygonDelegatorsCount.pending, () => {})
      .addCase(getWitvalPolygonDelegatorsCount.fulfilled, (state, action) => {
        state.witvalNonCosmosValidators.delegators = {
          ...state.witvalNonCosmosValidators.delegators,
          polygon: action.payload?.data?.summary?.total,
        };
      })
      .addCase(getWitvalPolygonDelegatorsCount.rejected, () => {});

    builder
      .addCase(getWitvalOasisDelegations.pending, () => {})
      .addCase(getWitvalOasisDelegations.fulfilled, (state, action) => {
        state.witvalNonCosmosValidators.delegators = {
          ...state.witvalNonCosmosValidators.delegators,
          oasis: action.payload?.data,
        };
      })
      .addCase(getWitvalOasisDelegations.rejected, () => {});

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

    builder
      .addCase(txCancelUnbonding.pending, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].cancelUnbondingTxStatus = TxStatus.PENDING;
      })
      .addCase(txCancelUnbonding.fulfilled, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].cancelUnbondingTxStatus = TxStatus.IDLE;
      })
      .addCase(txCancelUnbonding.rejected, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        state.chains[chainID].cancelUnbondingTxStatus = TxStatus.REJECTED;
      });

    // restake transaction
    builder
      .addCase(txRestake.pending, (state, action) => {
        const { chainID } = action.meta.arg.basicChainInfo;
        const isTxAll = action.meta.arg.isTxAll;
        state.chains[chainID].isTxAll = !!isTxAll;
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
  resetCancelUnbondingTx,
  resetCompleteState,
  resetAuthz,
  resetAuthzDelegations,
  setValidators,
  setSearchQuery,
  filterValidators,
} = stakeSlice.actions;

export default stakeSlice.reducer;
