'use client';

import { TxStatus } from '@/types/enums';
import { ERR_UNKNOWN } from '@/utils/errors';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { setError } from '../common/commonSlice';
import axios from 'axios';
import { cleanURL } from '@/utils/util';
import { parseTxResult } from '@/utils/signing';
import { getCodes, getContractsByCode } from './cosmwasmService';

/* eslint-disable @typescript-eslint/no-explicit-any */
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
    txHash: string;
    txResponse: ParsedUploadTxnResponse;
  };
  txInstantiate: {
    status: TxStatus;
    error: string;
    txHash: string;
    txResponse: ParsedInstatiateTxnResponse;
  };
  txExecute: {
    status: TxStatus;
    error: string;
    txHash: string;
    txResponse: ParsedExecuteTxnResponse;
  };
  query: {
    status: TxStatus;
    error: string;
    queryOutput: string;
  };
  codes: {
    status: TxStatus;
    error: string;
    data: {
      codes: CodeInfo[];
    };
  };
  contracts: {
    status: TxStatus;
    error: string;
    data: {
      contracts: string[];
      codeId: string;
    };
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
      txResponse: {
        code: 0,
        fee: [],
        transactionHash: '',
        rawLog: '',
        memo: '',
        codeId: '',
      },
      txHash: '',
    },
    txInstantiate: {
      status: TxStatus.INIT,
      error: '',
      txHash: '',
      txResponse: {
        code: 0,
        fee: [],
        transactionHash: '',
        rawLog: '',
        memo: '',
        codeId: '',
        contractAddress: '',
      },
    },
    txExecute: {
      status: TxStatus.INIT,
      error: '',
      txHash: '',
      txResponse: {
        code: 0,
        fee: [],
        transactionHash: '',
        rawLog: '',
        memo: '',
      },
    },
    query: {
      queryOutput: '',
      status: TxStatus.INIT,
      error: '',
    },
    codes: {
      data: { codes: [] },
      error: '',
      status: TxStatus.INIT,
    },
    contracts: {
      data: {
        codeId: '',
        contracts: [],
      },
      error: '',
      status: TxStatus.INIT,
    },
  },
};

export const queryContractInfo = createAsyncThunk(
  'cosmwasm/query-contract',
  async (data: QueryContractInfoInputs, { rejectWithValue, dispatch }) => {
    try {
      const response = await data.getQueryContract(data);
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

export const getAllCodes = createAsyncThunk(
  'cosmwasm/get-codes',
  async (
    data: { baseURLs: string[]; chainID: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await getCodes(data.baseURLs);
      return {
        data: response.data,
        chainID: data.chainID,
      };
    } catch (error: any) {
      const errMsg = error?.message || 'Failed to fetch codes';
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

export const getAllContractsByCode = createAsyncThunk(
  'cosmwasm/get-contract-by-code',
  async (
    data: { baseURLs: string[]; codeId: string; chainID: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await getContractsByCode(data.baseURLs, data.codeId);
      return {
        data: {
          contracts: response.data,
          code: data.codeId,
        },
        chainID: data.chainID,
      };
    } catch (error: any) {
      const errMsg = error?.message || 'Failed to fetch contracts';
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

export const executeContract = createAsyncThunk(
  'cosmwasm/execute-contract',
  async (data: ExecuteContractInputs, { rejectWithValue, dispatch }) => {
    try {
      const response = await data.getExecutionOutput(data);
      const txn = await axios.get(
        cleanURL(data.baseURLs[0]) + '/cosmos/tx/v1beta1/txs/' + response.txHash
      );
      const {
        code,
        transactionHash,
        fee = [],
        memo = '',
        rawLog = '',
      } = parseTxResult(txn?.data?.tx_response);
      return {
        data: { code, transactionHash, fee, memo, rawLog },
        chainID: data.chainID,
      };
    } catch (error: any) {
      const errMsg = error?.message || 'Failed to execute contract';
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

export const uploadCode = createAsyncThunk(
  'cosmwasm/upload-code',
  async (data: UploadCodeInputs, { rejectWithValue, dispatch }) => {
    try {
      const response = await data.uploadContract(data);
      const txn = await axios.get(
        cleanURL(data.baseURLs[0]) + '/cosmos/tx/v1beta1/txs/' + response.txHash
      );
      const {
        code,
        transactionHash,
        fee = [],
        memo = '',
        rawLog = '',
      } = parseTxResult(txn?.data?.tx_response);
      return {
        data: {
          code,
          transactionHash,
          fee,
          memo,
          rawLog,
          codeId: response.codeId,
        },
        chainID: data.chainID,
      };
    } catch (error: any) {
      const errMsg = error?.message || 'Failed to execute contract';
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

export const txInstantiateContract = createAsyncThunk(
  'cosmwasm/instantiate-contract',
  async (data: InstantiateContractInputs, { rejectWithValue, dispatch }) => {
    try {
      const response = await data.instantiateContract(data);
      const txn = await axios.get(
        cleanURL(data.baseURLs[0]) + '/cosmos/tx/v1beta1/txs/' + response.txHash
      );
      const {
        code,
        transactionHash,
        fee = [],
        memo = '',
        rawLog = '',
      } = parseTxResult(txn?.data?.tx_response);
      return {
        data: {
          code,
          transactionHash,
          fee,
          memo,
          rawLog,
          codeId: response.codeId,
          contractAddress: response.contractAddress,
        },
        chainID: data.chainID,
      };
    } catch (error: any) {
      const errMsg = error?.message || 'Failed to execute contract';
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

    builder
      .addCase(getAllCodes.pending, (state, action) => {
        const chainID = action.meta.arg.chainID;
        if (!state.chains[chainID]) {
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        }
        state.chains[chainID].codes.status = TxStatus.PENDING;
        state.chains[chainID].codes.error = '';
      })
      .addCase(getAllCodes.fulfilled, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].codes.status = TxStatus.IDLE;
        state.chains[chainID].codes.error = '';
        state.chains[chainID].codes.data.codes =
          action.payload.data?.code_infos || [];
      })
      .addCase(getAllCodes.rejected, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].codes.status = TxStatus.REJECTED;
        state.chains[chainID].codes.error = action.error.message || ERR_UNKNOWN;
        state.chains[chainID].codes.data.codes = [];
      });
    builder
      .addCase(getAllContractsByCode.pending, (state, action) => {
        const chainID = action.meta.arg.chainID;
        if (!state.chains[chainID]) {
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        }
        state.chains[chainID].contracts.status = TxStatus.PENDING;
        state.chains[chainID].contracts.error = '';
      })
      .addCase(getAllContractsByCode.fulfilled, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].contracts.status = TxStatus.IDLE;
        state.chains[chainID].contracts.error = '';
        state.chains[chainID].contracts.data.contracts =
          action.payload.data?.contracts?.contracts || [];
        state.chains[chainID].contracts.data.codeId =
          action.payload.data?.code || '';
      })
      .addCase(getAllContractsByCode.rejected, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].contracts.status = TxStatus.REJECTED;
        state.chains[chainID].contracts.error =
          action.error.message || ERR_UNKNOWN;
        state.chains[chainID].contracts.data.contracts = [];
        state.chains[chainID].contracts.data.codeId = '';
      });
    builder
      .addCase(executeContract.pending, (state, action) => {
        const chainID = action.meta.arg.chainID;
        if (!state.chains[chainID]) {
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        }
        state.chains[chainID].txExecute.status = TxStatus.PENDING;
        state.chains[chainID].txExecute.error = '';
      })
      .addCase(executeContract.fulfilled, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].txExecute.status = TxStatus.IDLE;
        state.chains[chainID].txExecute.error = '';
        state.chains[chainID].txExecute.txResponse = action.payload.data;
        state.chains[chainID].txExecute.txHash =
          action.payload.data.transactionHash;
      })
      .addCase(executeContract.rejected, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].txExecute.status = TxStatus.REJECTED;
        state.chains[chainID].txExecute.error =
          action.error.message || ERR_UNKNOWN;
      });
    builder
      .addCase(uploadCode.pending, (state, action) => {
        const chainID = action.meta.arg.chainID;
        if (!state.chains[chainID]) {
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        }
        state.chains[chainID].txUpload.status = TxStatus.PENDING;
        state.chains[chainID].txUpload.error = '';
      })
      .addCase(uploadCode.fulfilled, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].txUpload.status = TxStatus.IDLE;
        state.chains[chainID].txUpload.error = '';
        state.chains[chainID].txUpload.txResponse = action.payload.data;
        state.chains[chainID].txUpload.txHash =
          action.payload.data.transactionHash;
      })
      .addCase(uploadCode.rejected, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].txUpload.status = TxStatus.REJECTED;
        state.chains[chainID].txUpload.error =
          action.error.message || ERR_UNKNOWN;
      });
    builder
      .addCase(txInstantiateContract.pending, (state, action) => {
        const chainID = action.meta.arg.chainID;
        if (!state.chains[chainID]) {
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        }
        state.chains[chainID].txInstantiate.status = TxStatus.PENDING;
        state.chains[chainID].txInstantiate.error = '';
      })
      .addCase(txInstantiateContract.fulfilled, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].txInstantiate.status = TxStatus.IDLE;
        state.chains[chainID].txInstantiate.error = '';
        state.chains[chainID].txInstantiate.txResponse = action.payload.data;
        state.chains[chainID].txInstantiate.txHash =
          action.payload.data.transactionHash;
      })
      .addCase(txInstantiateContract.rejected, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.chains[chainID].txInstantiate.status = TxStatus.REJECTED;
        state.chains[chainID].txInstantiate.error =
          action.error.message || ERR_UNKNOWN;
      });
  },
});

export const { setContract } = cosmwasmSlice.actions;

export default cosmwasmSlice.reducer;
