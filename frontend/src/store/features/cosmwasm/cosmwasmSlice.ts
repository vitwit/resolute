'use client';

import { TxStatus } from '@/types/enums';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';

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
  };
  query: {
    status: TxStatus;
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
    },
    query: {
      status: TxStatus.INIT,
      error: '',
    },
  },
};

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
      }>
    ) => {
      const chainID = action.payload.chainID;
      if (!state.chains[chainID]) {
        state.chains[chainID] = cloneDeep(initialState.defaultState);
      }
      state.chains[chainID].txExecute.status = action.payload.status;
      state.chains[chainID].txExecute.error = action.payload.error;
      state.chains[chainID].txExecute.txHash = action.payload.txHash;
    },
    setQueryStatus: (
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
      state.chains[chainID].query.status = action.payload.status;
      state.chains[chainID].query.error = action.payload.error;
    },
  },
});

export const {
  setContract,
  setQueryStatus,
  setTxExecuteStatus,
  setTxInstantiateStatus,
  setTxUploadStatus,
} = cosmwasmSlice.actions;

export default cosmwasmSlice.reducer;
