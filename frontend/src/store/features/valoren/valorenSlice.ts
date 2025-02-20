import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import valorenService, {
  Action,
  RegisterActionPayload,
} from './valorenService';
import { ERR_UNKNOWN } from '../../../utils/errors';
import { TxStatus } from '@/types/enums';
import { VALOREN_OFFCHAIN_MESSAGE, COSMOS_CHAIN_ID } from '@/utils/constants';
import { getStoredValorenAuth, storeValorenAuth } from '@/utils/localStorage';
import { setError } from '../common/commonSlice';

declare let window: WalletWindow;

interface ValorenState {
  userActions: {
    actions: Action[];
    status: TxStatus;
    error: string;
  };
  registerActionRes: {
    status: TxStatus;
    error: string;
  };
}

const initialState: ValorenState = {
  userActions: {
    actions: [],
    status: TxStatus.INIT,
    error: '',
  },
  registerActionRes: {
    status: TxStatus.INIT,
    error: '',
  },
};

export const getUserActions = createAsyncThunk(
  'valoren/getUserActions',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await valorenService.getActionsByUser(userId);
      return response.data;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error ?? error.message ?? ERR_UNKNOWN;
      return rejectWithValue({
        message: errMsg,
      });
    }
  }
);

export const registerAction = createAsyncThunk(
  'valoren/registerAction',
  async (
    data: { payload: RegisterActionPayload; cosmosAddress: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      let pubKey: string;
      let signature: string;

      const storedAuth = getStoredValorenAuth();

      if (storedAuth && storedAuth.address === data.cosmosAddress) {
        pubKey = storedAuth.pubKey;
        signature = storedAuth.signature;
      } else {
        const token = await window.wallet.signArbitrary(
          COSMOS_CHAIN_ID,
          data.cosmosAddress,
          VALOREN_OFFCHAIN_MESSAGE
        );

        pubKey = token.pub_key.value;
        signature = token.signature;
        storeValorenAuth(pubKey, signature, data.cosmosAddress);
      }

      const response = await valorenService.registerAction(
        data.payload,
        pubKey,
        signature
      );

      return response.data;
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error ?? error.message ?? ERR_UNKNOWN;
      dispatch(
        setError({
          message: errMsg,
          type: 'error',
        })
      );
      return rejectWithValue({
        message: errMsg,
      });
    }
  }
);

export const valorenSlice = createSlice({
  name: 'valoren',
  initialState,
  reducers: {
    resetRegisterActionRes: (state) => {
      state.registerActionRes = initialState.registerActionRes;
    },
    resetUserActions: (state) => {
      state.userActions = initialState.userActions;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserActions.pending, (state) => {
        state.userActions.status = TxStatus.PENDING;
        state.userActions.error = '';
      })
      .addCase(getUserActions.fulfilled, (state, action) => {
        state.userActions.status = TxStatus.IDLE;
        state.userActions.error = '';
        state.userActions.actions = action.payload || [];
      })
      .addCase(getUserActions.rejected, (state, action) => {
        state.userActions.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.userActions.error = payload.message || '';
        state.userActions.actions = [];
      });

    builder
      .addCase(registerAction.pending, (state) => {
        state.registerActionRes.status = TxStatus.PENDING;
        state.registerActionRes.error = '';
      })
      .addCase(registerAction.fulfilled, (state) => {
        state.registerActionRes.status = TxStatus.IDLE;
        state.registerActionRes.error = '';
      })
      .addCase(registerAction.rejected, (state, action) => {
        state.registerActionRes.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.registerActionRes.error = payload.message || '';
      });
  },
});

export const { resetRegisterActionRes, resetUserActions } =
  valorenSlice.actions;

export default valorenSlice.reducer;
