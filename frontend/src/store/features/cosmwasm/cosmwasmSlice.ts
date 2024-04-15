'use client';

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
  },
});

export const { setContract } = cosmwasmSlice.actions;

export default cosmwasmSlice.reducer;
