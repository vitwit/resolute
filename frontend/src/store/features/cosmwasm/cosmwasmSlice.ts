'use client';

import useContracts from '@/custom-hooks/useContracts';
import { TxStatus } from '@/types/enums';
import { ERR_UNKNOWN } from '@/utils/errors';
import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { setError } from '../common/commonSlice';

export const contractInfoEmptyState = {
  admin: '',
  label: '',
  code_id: '',
  creator: '',
  created: {
    block_height: '',
    tx_index: '',
  },
  ibc_port_id: '',
  extension: null,
};

interface Chain {
  contractAddress: string;
  contractInfo: ContractInfo;
  txUpload: {
    status: TxStatus;
    error: string;
    codeID: string;
    txHash: string;
  };
  txInstantiate: {
    status: TxStatus;
    error: string;
  };
  txExecute: {
    status: TxStatus;
    error: string;
    txHash: string;
    txResponse: ParsedExecuteTxnReponse;
  };
  query: {
    status: TxStatus;
    error: string;
    queryOutput: string;
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
    contractInfo: contractInfoEmptyState,
    txUpload: {
      status: TxStatus.INIT,
      error: '',
      codeID: '',
      txHash: '',
    },
    txInstantiate: {
      status: TxStatus.INIT,
      error: '',
    },
    txExecute: {
      status: TxStatus.INIT,
      error: '',
      txHash: '',
      txResponse: {
        code: 0,
        gasUsed: 0,
        gasWanted: 0,
        transactionHash: '',
        rawLog: '',
      },
    },
    query: {
      queryOutput: '',
      status: TxStatus.INIT,
      error: '',
    },
  },
};

export const queryContractInfo = createAsyncThunk(
  'cosmwasm/query-contract',
  async (
    data: {
      address: string;
      baseURLs: string[];
      queryData: string;
      chainID: string;
      getQueryContractOutput: ({
        address,
        baseURLs,
        queryData,
      }: {
        address: string;
        baseURLs: string[];
        queryData: string;
      }) => Promise<{
        data: any;
      }>;
    },
    { rejectWithValue, dispatch }
  ) => {
    // const { getQueryContractOutput } = useContracts();
    try {
      const response = await data.getQueryContractOutput(data);
      return {
        data: response.data,
        chainID: data.chainID,
      };
    } catch (error: any) {
      const errMsg = error?.message || 'Failed to query contract';
      dispatch(
        setError({
          message: errMsg,
          type: 'error',
        })
      );
      return rejectWithValue(errMsg);
    }
  }
);

export const cosmwasmSlice = createSlice({
  name: 'cosmwasm',
  initialState,
  reducers: {
    setContract: (
      state,
      action: PayloadAction<{
        contractAddress: string;
        contractInfo: ContractInfo;
        chainID: string;
      }>
    ) => {
      const chainID = action.payload.chainID;
      if (!state.chains[chainID]) {
        state.chains[chainID] = cloneDeep(initialState.defaultState);
      }
      state.chains[chainID].contractInfo = action.payload.contractInfo;
      state.chains[chainID].contractAddress = action.payload.contractAddress;
    },
    setTxUploadStatus: (
      state,
      action: PayloadAction<{
        status: TxStatus;
        error: string;
        chainID: string;
        txHash: string;
        codeID: string;
      }>
    ) => {
      const chainID = action.payload.chainID;
      if (!state.chains[chainID]) {
        state.chains[chainID] = cloneDeep(initialState.defaultState);
      }
      state.chains[chainID].txUpload.status = action.payload.status;
      state.chains[chainID].txUpload.error = action.payload.error;
      state.chains[chainID].txUpload.codeID = action.payload.codeID;
      state.chains[chainID].txUpload.txHash = action.payload.txHash;
    },
    setTxInstantiateStatus: (
      state,
      action: PayloadAction<{
        status: TxStatus;
        error: string;
        chainID: string;
      }>
    ) => {
      const chainID = action.payload.chainID;
      if (!state.chains[chainID]) {
        state.chains[chainID] = cloneDeep(initialState.defaultState);
      }
      state.chains[chainID].txInstantiate.status = action.payload.status;
      state.chains[chainID].txInstantiate.error = action.payload.error;
    },
    setTxExecuteStatus: (
      state,
      action: PayloadAction<{
        status: TxStatus;
        error: string;
        chainID: string;
        txHash: string;
        txnReponse: ParsedExecuteTxnReponse;
      }>
    ) => {
      const chainID = action.payload.chainID;
      if (!state.chains[chainID]) {
        state.chains[chainID] = cloneDeep(initialState.defaultState);
      }
      state.chains[chainID].txExecute.status = action.payload.status;
      state.chains[chainID].txExecute.error = action.payload.error;
      state.chains[chainID].txExecute.txHash = action.payload.txHash;
      state.chains[chainID].txExecute.txResponse = action.payload.txnReponse;
    },
    setTxExecuteLoading: (
      state,
      action: PayloadAction<{ chainID: string; status: TxStatus }>
    ) => {
      const chainID = action.payload.chainID;
      if (!state.chains[chainID]) {
        state.chains[chainID] = cloneDeep(initialState.defaultState);
      }
      state.chains[chainID].txExecute.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(queryContractInfo.pending, (state, action) => {
        const chainID = action.meta.arg.chainID;
        if (!state.chains[chainID]) {
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        }
        state.chains[chainID].query.status = TxStatus.PENDING;
        state.chains[chainID].query.error = '';
      })
      .addCase(queryContractInfo.fulfilled, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].query.status = TxStatus.IDLE;
        state.chains[chainID].query.error = '';
        state.chains[chainID].query.queryOutput = action.payload.data;
      })
      .addCase(queryContractInfo.rejected, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].query.status = TxStatus.REJECTED;
        state.chains[chainID].query.error = action.error.message || ERR_UNKNOWN;
        state.chains[chainID].query.queryOutput = '{}';
      });
  },
});

export const {
  setContract,
  setTxExecuteStatus,
  setTxInstantiateStatus,
  setTxUploadStatus,
  setTxExecuteLoading,
} = cosmwasmSlice.actions;

export default cosmwasmSlice.reducer;
