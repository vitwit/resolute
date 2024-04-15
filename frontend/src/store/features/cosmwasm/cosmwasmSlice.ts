'use client';

import { TxStatus } from '@/types/enums';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import cosmwasmService from './cosmwasmService';
import { cloneDeep } from 'lodash';

interface ContractInfo {
  code_id: string;
  creater: string;
  admin: string;
  label: string;
  created: {
    block_height: string;
    tx_index: string;
  };
  ibc_port_id: string;
  extension: string | null;
}

interface Chain {
  contractAddress: string;
  contractInfo: ContractInfo;
  contractSearchStatus: {
    loading: TxStatus;
    error: string;
  };
}

interface Chains {
  [key: string]: Chain;
}

interface CosmwasmState {
  chains: Chains;
  defaultState: Chain;
}

const initialState: CosmwasmState = {
  chains: {},
  defaultState: {
    contractAddress: '',
    contractInfo: {
      admin: '',
      label: '',
      code_id: '',
      creater: '',
      created: {
        block_height: '',
        tx_index: '',
      },
      ibc_port_id: '',
      extension: null,
    },
    contractSearchStatus: {
      loading: TxStatus.INIT,
      error: '',
    },
  },
};

export const getContract = createAsyncThunk(
  'cosmwasm/get-contract',
  async (
    data: { baseURLs: string[]; address: string; chainID: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await cosmwasmService.contract(
        data.baseURLs,
        data.address
      );
      return {
        data: response.data,
        chainID: data.chainID,
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch contract');
    }
  }
);

export const cosmwasmSlice = createSlice({
  name: 'cosmwasm',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getContract.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains?.[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        state.chains[chainID].contractSearchStatus.loading = TxStatus.PENDING;
        state.chains[chainID].contractSearchStatus.error = '';
      })
      .addCase(getContract.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (state.chains?.[chainID]) {
          state.chains[chainID].contractAddress = action.payload.data.address;
          state.chains[chainID].contractInfo =
            action.payload.data?.contract_info;
          state.chains[chainID].contractSearchStatus.loading = TxStatus.IDLE;
        }
      })
      .addCase(getContract.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].contractSearchStatus.loading = TxStatus.REJECTED;
        state.chains[chainID].contractSearchStatus.error =
          action.error.message || 'rejected';
      });
  },
});

export const {} = cosmwasmSlice.actions;

export default cosmwasmSlice.reducer;
