'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import commonService from './commonService';
import { AxiosError } from 'axios';
import { ERR_UNKNOWN } from '../../../utils/errors';
import { networks } from '../../../utils/chainsInfo';
import { getLocalNetworks } from '@/utils/localStorage';
import { signAndBroadcast } from '@/utils/signing';
import { GAS_FEE } from '@/utils/constants';
import { NewTransaction } from '@/utils/transaction';
import { TxStatus } from '@/types/enums';
import {
  CommonState,
  ErrorState,
  GenericTxnInputs,
  InfoState,
  SelectedNetwork,
  TxSuccess,
} from '@/types/common';

const initialState: CommonState = {
  errState: {
    message: '',
    type: '',
  },
  txSuccess: {
    hash: '',
    tx: undefined,
  },
  txLoadRes: { load: false },
  tokensInfoState: {
    error: '',
    info: {
      denom: '',
      coingecko_name: '',
      enabled: false,
      last_updated: '',
      info: { usd: NaN, usd_24h_change: NaN },
    },
    status: 'idle',
  },
  allTokensInfoState: {
    error: '',
    info: {},
    status: 'idle',
  },
  changeNetworkDialog: {
    open: false,
    showSearch: false,
  },
  selectedNetwork: {
    chainName: '',
  },
  allNetworksInfo: {},
  nameToChainIDs: {},
  addNetworkOpen: false,
  genericTransaction: {
    status: TxStatus.INIT,
    errMsg: '',
  },
};

export const getTokenPrice = createAsyncThunk(
  'common/getTokenPrice',
  async (data: string, { rejectWithValue }) => {
    try {
      const response = await commonService.tokenInfo(data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.message);
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const getAllTokensPrice = createAsyncThunk(
  'common/getAllTokensPrice',
  async (data, { rejectWithValue }) => {
    try {
      const response = await commonService.allTokensInfo();
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.message);
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const txGeneric = createAsyncThunk(
  'common/tx-generic',
  async (
    data: GenericTxnInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    const { chainID, prefix, aminoConfig, feeAmount, address, rest, restURLs } =
      data.basicChainInfo;
    try {
      const result = await signAndBroadcast(
        chainID,
        aminoConfig,
        prefix,
        data.msgs,
        GAS_FEE,
        data.memo,
        `${feeAmount * data.basicChainInfo.decimals ** 10}${data.denom}`,
        rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined,
        '',
        restURLs
      );
      const tx = NewTransaction(result, data.msgs, chainID, address);
      dispatch(setTxAndHash({ tx, hash: tx.transactionHash }));
      if (result?.code === 0) {
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.log("error: ", error);
      const errMessage = error?.response?.data?.error || error?.message;
      dispatch(
        setError({
          type: 'error',
          message: errMessage || ERR_UNKNOWN,
        })
      );
      console.log("erro22", errMessage)
      return rejectWithValue(errMessage || ERR_UNKNOWN);
    }
  }
);

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<ErrorState>) => {
      state.errState = {
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    setTxAndHash: (state, action: PayloadAction<TxSuccess>) => {
      state.txSuccess = {
        hash: action.payload.hash,
        tx: action.payload.tx,
      };
    },
    setTxLoad: (state) => {
      state.txLoadRes = { load: true };
    },
    resetTxLoad: (state) => {
      state.txLoadRes = { load: false };
    },
    resetTxAndHash: (state) => {
      state.txSuccess = {
        hash: '',
        tx: undefined,
      };
    },
    resetError: (state) => {
      state.errState = {
        message: '',
        type: '',
      };
    },
    setChangeNetworkDialogOpen: (
      state,
      action: PayloadAction<{ open: boolean; showSearch: boolean }>
    ) => {
      state.changeNetworkDialog.open = action.payload.open;
      state.changeNetworkDialog.showSearch = action.payload.showSearch;
    },
    setAddNetworkDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.addNetworkOpen = action.payload;
    },
    setSelectedNetwork: (state, action: PayloadAction<SelectedNetwork>) => {
      state.selectedNetwork.chainName = action.payload.chainName;
    },
    setAllNetworksInfo: (state) => {
      state.allNetworksInfo = {};
      const networksList = [...networks, ...getLocalNetworks()];
      for (let i = 0; i < networksList.length; i++) {
        state.allNetworksInfo[networksList?.[i]?.config?.chainId] =
          networksList?.[i];
        state.nameToChainIDs[
          networksList?.[i]?.config?.chainName
            ?.toLowerCase()
            .split(' ')
            .join('')
        ] = networksList?.[i]?.config?.chainId;
      }
    },
    resetGenericTxStatus: (state) => {
      state.genericTransaction = initialState.genericTransaction;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTokenPrice.pending, (state) => {
        state.tokensInfoState.status = 'pending';
        state.tokensInfoState.error = '';
      })
      .addCase(getTokenPrice.fulfilled, (state, action) => {
        state.tokensInfoState.status = 'idle';
        state.tokensInfoState.error = '';
        state.tokensInfoState.info =
          action.payload.data || initialState.tokensInfoState.info;
      })
      .addCase(getTokenPrice.rejected, (state, action) => {
        state.tokensInfoState.status = 'rejected';
        state.tokensInfoState.error = JSON.stringify(action.payload) || '';
        state.tokensInfoState.info = initialState.tokensInfoState.info;
      });
    builder
      .addCase(getAllTokensPrice.pending, (state) => {
        state.allTokensInfoState.status = 'pending';
        state.allTokensInfoState.error = '';
      })
      .addCase(getAllTokensPrice.fulfilled, (state, action) => {
        const data = action.payload.data || [];
        const tokensPriceInfo = data.reduce(
          (result: Record<string, InfoState>, tokenInfo: InfoState) => {
            result[tokenInfo.denom] = tokenInfo;
            return result;
          },
          {}
        );
        state.allTokensInfoState.status = 'idle';
        state.allTokensInfoState.error = '';
        state.allTokensInfoState.info = tokensPriceInfo;
      })
      .addCase(getAllTokensPrice.rejected, (state, action) => {
        state.allTokensInfoState.status = 'rejected';
        state.allTokensInfoState.error = JSON.stringify(action.payload) || '';
        state.allTokensInfoState.info = {};
      });
    builder
      .addCase(txGeneric.pending, (state) => {
        state.genericTransaction.status = TxStatus.PENDING;
        state.genericTransaction.errMsg = '';
      })
      .addCase(txGeneric.fulfilled, (state) => {
        state.genericTransaction.status = TxStatus.IDLE;
        state.genericTransaction.errMsg = '';
      })
      .addCase(txGeneric.rejected, (state, action) => {
        state.genericTransaction.status = TxStatus.REJECTED;
        state.genericTransaction.errMsg = action.error.message || '';
      });
  },
});

export const {
  setError,
  resetError,
  setTxLoad,
  resetTxLoad,
  setTxAndHash,
  resetTxAndHash,
  setSelectedNetwork,
  setAllNetworksInfo,
  setChangeNetworkDialogOpen,
  setAddNetworkDialogOpen,
  resetGenericTxStatus,
} = commonSlice.actions;

export default commonSlice.reducer;
