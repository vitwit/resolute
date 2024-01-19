'use client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import distService from './distributionService';
import cloneDeep from 'lodash/cloneDeep';
import {
  ChainsMap,
  DelegatorTotalRewardsRequest,
  DistributionStoreInitialState,
  TxWithdrawAllRewardsInputs,
} from '@/types/distribution';
import { getDenomBalance } from '@/utils/denom';
import { setError, setTxAndHash } from '../common/commonSlice';
import { AxiosError } from 'axios';
import { ERR_UNKNOWN } from '@/utils/errors';
import { signAndBroadcast } from '@/utils/signing';
import { WithdrawAllRewardsMsg } from '@/txns/distribution/withDrawRewards';
import { TxStatus } from '@/types/enums';
import { GAS_FEE } from '@/utils/constants';
import { NewTransaction } from '@/utils/transaction';
import { addTransactions } from '../transactionHistory/transactionHistorySlice';
import { getAuthzBalances, getBalances } from '../bank/bankSlice';

const initialState: DistributionStoreInitialState = {
  chains: {},
  authzChains: {},
  defaultState: {
    delegatorRewards: {
      list: [],
      totalRewards: 0,
      status: TxStatus.INIT,
      errMsg: '',
      pagination: {},
    },
    tx: {
      status: TxStatus.INIT,
      txHash: '',
    },
    isTxAll: false,
  },
};

export const txWithdrawAllRewards = createAsyncThunk(
  'distribution/withdraw-all-rewards',
  async (
    data: TxWithdrawAllRewardsInputs | TxAuthzExecInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      let msgs = [];
      if (data.isAuthzMode) {
        msgs = data.msgs;
      } else {
        for (let i = 0; i < data.msgs.length; i++) {
          const msg = data.msgs[i];
          msgs.push(WithdrawAllRewardsMsg(msg.delegator, msg.validator));
        }
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
        data?.feegranter?.length ? data.feegranter : undefined
      );
      const tx = NewTransaction(
        result,
        msgs,
        data.basicChainInfo.chainID,
        data.basicChainInfo.address
      );
      dispatch(
        addTransactions({
          chainID: data.basicChainInfo.chainID,
          address: data.basicChainInfo.cosmosAddress,
          transactions: [tx],
        })
      );

      if (result?.code === 0) {
        if (data.isAuthzMode) {
          dispatch(
            getAuthzBalances({
              baseURLs: data.basicChainInfo.restURLs,
              baseURL: data.basicChainInfo.rest,
              chainID: data.basicChainInfo.chainID,
              address: data.authzChainGranter,
            })
          );

          dispatch(
            getAuthzDelegatorTotalRewards({
              baseURL: data.basicChainInfo.rest,
              baseURLs: data.basicChainInfo.restURLs,
              address: data.authzChainGranter,
              chainID: data.basicChainInfo.chainID,
              denom: data.denom,
            })
          );
        } else {
          dispatch(
            getBalances({
              baseURLs: data.basicChainInfo.restURLs,
              baseURL: data.basicChainInfo.rest,
              address: data.basicChainInfo.address,
              chainID: data.basicChainInfo.chainID,
            })
          );

          dispatch(
            getDelegatorTotalRewards({
              baseURL: data.basicChainInfo.rest,
              baseURLs: data.basicChainInfo.restURLs,
              address: data.basicChainInfo.address,
              chainID: data.basicChainInfo.chainID,
              denom: data.denom,
            })
          );
        }

        dispatch(
          setTxAndHash({
            hash: result?.transactionHash,
            tx: tx,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: 'error',
            message: result?.rawLog || '',
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(
          setError({
            type: 'error',
            message: error.message,
          })
        );
        return rejectWithValue(error.message);
      }
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const getDelegatorTotalRewards = createAsyncThunk(
  'distribution/totalRewards',
  async (data: DelegatorTotalRewardsRequest) => {
    const response = await distService.delegatorRewards(
      data.baseURLs,
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
  'distribution/authz-totalRewards',
  async (data: DelegatorTotalRewardsRequest) => {
    const response = await distService.delegatorRewards(
      data.baseURLs,
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
  name: 'distribution',
  initialState,
  reducers: {
    resetTx: (state, action) => {
      const chainID = action.payload.chainID;
      if (state.chains[chainID].tx) {
        state.chains[chainID].tx = cloneDeep(initialState.defaultState.tx);
      }
    },
    resetDefaultState: (state, action) => {
      const chainsMap: ChainsMap = {};
      const chains = action.payload;
      chains.map((chainID: string) => {
        chainsMap[chainID] = cloneDeep(initialState.defaultState);
      });
      state.chains = chainsMap;
    },
    resetChainRewards: (state, action) => {
      const chainID = action.payload.chainID;
      state.chains[chainID].delegatorRewards = cloneDeep(
        initialState.defaultState.delegatorRewards
      );
    },
    resetState: (state) => {
      /* eslint-disable-next-line */
      state = cloneDeep(initialState);
    },
    resetAuthz: (state) => {
      state.authzChains = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDelegatorTotalRewards.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        state.chains[chainID].delegatorRewards.status = TxStatus.PENDING;
        state.chains[chainID].delegatorRewards.errMsg = '';
        state.chains[chainID].delegatorRewards.totalRewards = 0;
        state.chains[chainID].delegatorRewards.list = [];
        state.chains[chainID].delegatorRewards.pagination = {};
      })
      .addCase(getDelegatorTotalRewards.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        const denom = action.meta.arg.denom;
        if (state.chains[chainID]) {
          state.chains[chainID].delegatorRewards.status = TxStatus.IDLE;
          state.chains[chainID].delegatorRewards.list =
            action.payload.data.rewards;
          const totalRewardsList = action?.payload?.data?.total;
          state.chains[chainID].delegatorRewards.totalRewards = getDenomBalance(
            totalRewardsList,
            denom
          );
          state.chains[chainID].delegatorRewards.pagination =
            action.payload.data.pagination;
          state.chains[chainID].delegatorRewards.errMsg = '';
        }
      })
      .addCase(getDelegatorTotalRewards.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (state.chains[chainID]) {
          state.chains[chainID].delegatorRewards.status = TxStatus.REJECTED;
          state.chains[chainID].delegatorRewards.errMsg =
            action.error.message || '';
        }
      });

    builder
      .addCase(getAuthzDelegatorTotalRewards.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (!state.authzChains[chainID])
          state.authzChains[chainID] = cloneDeep(initialState.defaultState);
        state.authzChains[chainID].delegatorRewards.status = TxStatus.PENDING;
        state.authzChains[chainID].delegatorRewards.errMsg = '';
        state.authzChains[chainID].delegatorRewards.totalRewards = 0;
        state.authzChains[chainID].delegatorRewards.list = [];
        state.authzChains[chainID].delegatorRewards.pagination = {};
      })
      .addCase(getAuthzDelegatorTotalRewards.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        const denom = action.meta.arg.denom;
        if (state.authzChains[chainID]) {
          state.authzChains[chainID].delegatorRewards.status = TxStatus.IDLE;
          state.authzChains[chainID].delegatorRewards.list =
            action.payload.data.rewards;
          const totalRewardsList = action?.payload?.data?.total;
          state.authzChains[chainID].delegatorRewards.totalRewards =
            getDenomBalance(totalRewardsList, denom);
          state.authzChains[chainID].delegatorRewards.pagination =
            action.payload.data.pagination;
          state.authzChains[chainID].delegatorRewards.errMsg = '';
        }
      })
      .addCase(getAuthzDelegatorTotalRewards.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (state.authzChains[chainID]) {
          state.authzChains[chainID].delegatorRewards.status =
            TxStatus.REJECTED;
          state.authzChains[chainID].delegatorRewards.errMsg =
            action.error.message || '';
        }
      });
    builder
      .addCase(txWithdrawAllRewards.pending, (state, action) => {
        const chainID = action.meta?.arg?.basicChainInfo.chainID;
        const isTxAll = action.meta.arg.isTxAll;
        state.chains[chainID].isTxAll = !!isTxAll;
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.txHash = '';
      })
      .addCase(txWithdrawAllRewards.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.basicChainInfo.chainID;
        state.chains[chainID].tx.status = TxStatus.IDLE;
        state.chains[chainID].tx.txHash = action.payload.txHash;
      })
      .addCase(txWithdrawAllRewards.rejected, (state, action) => {
        const chainID = action.meta?.arg?.basicChainInfo.chainID;
        state.chains[chainID].tx.status = TxStatus.REJECTED;
        state.chains[chainID].tx.txHash = '';
      });
  },
});

export const {
  resetTx,
  resetDefaultState,
  resetChainRewards,
  resetState,
  resetAuthz,
} = distSlice.actions;
export default distSlice.reducer;
