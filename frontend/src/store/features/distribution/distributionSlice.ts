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
import { setError, setTxHash } from '../common/commonSlice';
import { AxiosError } from 'axios';
import { ERR_UNKNOWN } from '@/utils/errors';
import { signAndBroadcast } from '@/utils/signing';
import { WithdrawAllRewardsMsg } from '@/txns/distribution/withDrawRewards';
import { TxStatus } from '@/types/enums';
import { GAS_FEE } from '@/utils/constants';

const initialState: DistributionStoreInitialState = {
  chains: {},
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
  },
};

export const txWithdrawAllRewards = createAsyncThunk(
  'distribution/withdraw-all-rewards',
  async (
    data: TxWithdrawAllRewardsInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
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
        GAS_FEE,
        '',
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
        const denom = action.meta?.arg?.denom || '';
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
      .addCase(txWithdrawAllRewards.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.txHash = '';
      })
      .addCase(txWithdrawAllRewards.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = TxStatus.IDLE;
        state.chains[chainID].tx.txHash = action.payload.txHash;
      })
      .addCase(txWithdrawAllRewards.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = TxStatus.REJECTED;
        state.chains[chainID].tx.txHash = '';
      });
  },
});

export const { resetTx, resetDefaultState, resetChainRewards } =
  distSlice.actions;
export default distSlice.reducer;
