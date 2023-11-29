'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import multisigService from './multisigService';
import { AxiosError } from 'axios';
import { ERR_UNKNOWN, WALLET_REQUEST_ERROR } from '../../../utils/errors';
import { OFFCHAIN_VERIFICATION_MESSAGE } from '@/utils/constants';
import { TxStatus } from '@/types/enums';
import bankService from '@/store/features/bank/bankService';

interface MultisigAccounts {
  status: TxStatus;
  accounts: Account[];
  txnCounts: { [address: string]: number };
  total: number;
}
interface MultisigAccount {
  account: Account;
  pubkeys: MultisigAddressPubkey[];
  status: TxStatus;
  error: string;
}

interface Account {
  address: string;
  threshhold: number;
  chain_id: string;
  pubkey_type: string;
  created_at: string;
  created_by: string;
  name: string;
}

interface VerifyAcccountRes {
  token: string;
  status: TxStatus;
  error: string;
}

interface CreateMultisigAccountRes {
  status: TxStatus;
  error: string;
}

interface DeleteTxnRes {
  status: TxStatus;
  error: string;
}

interface Balance {
  balance: {
    denom: string;
    amount: string;
  };
  status: TxStatus;
  error: string;
}

interface MultisigState {
  multisigAccounts: MultisigAccounts;
  verifyAccountRes: VerifyAcccountRes;
  createMultisigAccountRes: CreateMultisigAccountRes;
  deleteTxnRes: DeleteTxnRes;
  multisigAccount: MultisigAccount;
  balance: Balance;
}

const initialState: MultisigState = {
  createMultisigAccountRes: {
    status: TxStatus.INIT,
    error: '',
  },
  multisigAccounts: {
    status: TxStatus.IDLE,
    accounts: [],
    txnCounts: {},
    total: 0,
  },
  multisigAccount: {
    account: {
      address: '',
      threshhold: 0,
      chain_id: '',
      pubkey_type: '',
      created_at: '',
      created_by: '',
      name: '',
    },
    pubkeys: [],
    status: TxStatus.INIT,
    error: '',
  },
  deleteTxnRes: {
    status: TxStatus.INIT,
    error: '',
  },
  verifyAccountRes: {
    token: '',
    status: TxStatus.IDLE,
    error: '',
  },
  balance: {
    balance: {
      amount: '',
      denom: '',
    },
    status: TxStatus.INIT,
    error: '',
  },
};

declare let window: WalletWindow;

export const createAccount = createAsyncThunk(
  'multisig/createAccount',
  async (
    data: { queryParams: QueryParams; data: CreateAccountPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await multisigService.createAccount(
        data.queryParams,
        data.data
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const getMultisigAccounts = createAsyncThunk(
  'multisig/getMultisigAccounts',
  async (address: string, { rejectWithValue }) => {
    try {
      const response = await multisigService.getAccounts(address);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const verifyAccount = createAsyncThunk(
  'multisig/verifyAccount',
  async (data: { chainID: string; address: string }, { rejectWithValue }) => {
    try {
      const token = await window.wallet.signArbitrary(
        data.chainID,
        data.address,
        OFFCHAIN_VERIFICATION_MESSAGE
      );

      try {
        const response = await multisigService.verifyUser({
          address: data.address,
          signature: token.signature,
          salt: 10,
          pubKey: JSON.stringify(token.pub_key),
        });

        return {
          response,
          token,
        };
      } catch (error) {
        if (error instanceof AxiosError)
          return rejectWithValue({ message: error.message });
        return rejectWithValue({ message: ERR_UNKNOWN });
      }
    } catch (error) {
      return rejectWithValue(WALLET_REQUEST_ERROR);
    }
  }
);

export const deleteTxn = createAsyncThunk(
  'multisig/deleteTxn',
  async (data: DeleteTxnInputs, { rejectWithValue }) => {
    try {
      const response = await multisigService.deleteTx(
        data.queryParams,
        data.data.address,
        data.data.id
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const multisigByAddress = createAsyncThunk(
  'multisig/multisigByAddress',
  async (data: { address: string }, { rejectWithValue }) => {
    try {
      const response = await multisigService.getAccount(data.address);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const getMultisigBalance = createAsyncThunk(
  'multisig/multisigBalance',
  async (data: GetMultisigBalanceInputs, { rejectWithValue }) => {
    try {
      const response = await bankService.balance(
        data.baseURL,
        data.address,
        data.denom
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const multisigSlice = createSlice({
  name: 'multisig',
  initialState,
  reducers: {
    resetVerifyAccountRes: (state) => {
      state.verifyAccountRes = initialState.verifyAccountRes;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.createMultisigAccountRes.status = TxStatus.PENDING;
        state.createMultisigAccountRes.error = '';
      })
      .addCase(createAccount.fulfilled, (state) => {
        state.createMultisigAccountRes.status = TxStatus.IDLE;
        state.createMultisigAccountRes.error = '';
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.createMultisigAccountRes.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.createMultisigAccountRes.error = payload.message || '';
      });
    builder
      .addCase(getMultisigAccounts.pending, (state) => {
        state.multisigAccounts.status = TxStatus.PENDING;
        state.multisigAccounts.accounts = [];
        state.multisigAccounts.total = 0;
        state.multisigAccounts.txnCounts = {};
      })
      .addCase(getMultisigAccounts.fulfilled, (state, action) => {
        state.multisigAccounts.accounts = action.payload?.data?.accounts || [];
        state.multisigAccounts.total = action.payload?.data?.total;
        state.multisigAccounts.txnCounts =
          action.payload?.data?.pending_txns || {};
        state.multisigAccounts.status = TxStatus.IDLE;
      })
      .addCase(getMultisigAccounts.rejected, (state) => {
        state.multisigAccounts.status = TxStatus.REJECTED;
        state.multisigAccounts.accounts = [];
      });
    builder
      .addCase(verifyAccount.pending, (state) => {
        state.verifyAccountRes.status = TxStatus.PENDING;
        state.verifyAccountRes.error = '';
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.verifyAccountRes.token = action.payload.token.signature;
        state.verifyAccountRes.status = TxStatus.IDLE;
        state.verifyAccountRes.error = '';
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.verifyAccountRes.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.verifyAccountRes.error = payload.message || '';
      });
    builder
      .addCase(deleteTxn.pending, (state) => {
        state.deleteTxnRes.status = TxStatus.PENDING;
      })
      .addCase(deleteTxn.fulfilled, (state) => {
        state.deleteTxnRes.status = TxStatus.IDLE;
      })
      .addCase(deleteTxn.rejected, (state, action) => {
        state.deleteTxnRes.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.deleteTxnRes.error = payload.message || '';
      });
    builder
      .addCase(multisigByAddress.pending, (state) => {
        state.multisigAccount.status = TxStatus.PENDING;
        state.multisigAccount.account = initialState.multisigAccount.account;
        state.multisigAccount.error = '';
        state.multisigAccount.pubkeys = [];
      })
      .addCase(multisigByAddress.fulfilled, (state, action) => {
        state.multisigAccount.account = action.payload?.data?.account || {};
        state.multisigAccount.pubkeys = action.payload?.data?.pubkeys || [];
        state.multisigAccount.error = '';
        state.multisigAccount.status = TxStatus.IDLE;
      })
      .addCase(multisigByAddress.rejected, (state, action) => {
        const payload = action.payload as { message: string };
        state.multisigAccount.status = TxStatus.REJECTED;
        state.multisigAccount.error = payload.message || '';
      });
    builder
      .addCase(getMultisigBalance.pending, (state) => {
        state.balance.status = TxStatus.PENDING;
        state.balance.error = '';
      })
      .addCase(getMultisigBalance.fulfilled, (state, action) => {
        state.balance.status = TxStatus.IDLE;
        state.balance.error = '';
        state.balance.balance = action.payload.balance;
      })
      .addCase(getMultisigBalance.rejected, (state, action) => {
        state.balance.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.balance.error = payload.message || '';
      });
  },
});

export default multisigSlice.reducer;
