'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import commonService from './commonService';
import { AxiosError } from 'axios';
import { ERR_UNKNOWN } from '../../../utils/errors';

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
  selectedNetwork: {
    chainName: '',
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
    setSelectedNetwork: (state, action: PayloadAction<SelectedNetwork>) => {
      state.selectedNetwork.chainName = action.payload.chainName;
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
} = commonSlice.actions;

export default commonSlice.reducer;
