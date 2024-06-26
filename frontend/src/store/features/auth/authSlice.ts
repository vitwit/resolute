import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ERR_UNKNOWN } from '@/utils/errors';
import authService from './authService';
import { TxStatus } from '@/types/enums';
import { cloneDeep } from 'lodash';

export interface AccountInfoState {
  status: TxStatus;
  errMsg: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  account: BaseAccount | any;
}

export interface AuthState {
  [chainID: string]: AccountInfoState;
}

const defaultState = {
  status: TxStatus.IDLE,
  errMsg: '',
  account: {},
};

const initialState: AuthState = {};

export const getAccountInfo = createAsyncThunk(
  'auth/accountInfo',
  async (data: {
    chainID: string;
    baseURL: string;
    address: string;
    baseURLs: string[];
  }) => {
    const response = await authService.accountInfo(data.baseURLs, data.address, data.chainID);
    return response.data;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAccountsInfo: (state) => {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccountInfo.pending, (state, action) => {
        const { chainID } = action.meta.arg;
        if (!state[chainID]) {
          state[chainID] = cloneDeep(defaultState);
        }
        state[chainID].status = TxStatus.PENDING;
        state[chainID].errMsg = '';
      })
      .addCase(getAccountInfo.fulfilled, (state, action) => {
        const { chainID } = action.meta.arg;
        state[chainID].status = TxStatus.IDLE;
        state[chainID].errMsg = '';
        state[chainID].account = action.payload?.account || {};
      })
      .addCase(getAccountInfo.rejected, (state, action) => {
        const { chainID } = action.meta.arg;
        state[chainID].status = TxStatus.REJECTED;
        state[chainID].errMsg = action.error?.message || ERR_UNKNOWN;
        state[chainID].account = {};
      });
  },
});

export const { resetAccountsInfo } = authSlice.actions;

export default authSlice.reducer;
