'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import multisigService from './multisigService';
import { AxiosError } from 'axios';
import {
  ERR_UNKNOWN,
  NOT_MULTISIG_ACCOUNT_ERROR,
  NOT_MULTISIG_MEMBER_ERROR,
  WALLET_REQUEST_ERROR,
} from '../../../utils/errors';
import {
  MAX_SALT_VALUE,
  MIN_SALT_VALUE,
  MULTISIG_LEGACY_AMINO_PUBKEY_TYPE,
  OFFCHAIN_VERIFICATION_MESSAGE,
} from '@/utils/constants';
import { TxStatus } from '@/types/enums';
import bankService from '@/store/features/bank/bankService';
import {
  CreateAccountPayload,
  CreateTxnInputs,
  DeleteMultisigInputs,
  DeleteTxnInputs,
  GetMultisigBalanceInputs,
  GetTxnsInputs,
  ImportMultisigAccountRes,
  MultisigState,
  QueryParams,
  SignTxInputs,
  UpdateTxnInputs,
} from '@/types/multisig';
import { getRandomNumber, isMultisigAccountMember } from '@/utils/util';
import authService from './../auth/authService';
import { get } from 'lodash';

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
      threshold: 0,
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
    status: TxStatus.INIT,
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
  createTxnRes: {
    status: TxStatus.INIT,
    error: '',
  },
  updateTxnRes: {
    status: TxStatus.INIT,
    error: '',
  },
  signTxRes: {
    status: TxStatus.INIT,
    error: '',
  },
  txns: {
    list: [],
    status: TxStatus.INIT,
    error: '',
  },
  deleteMultisigRes: {
    status: TxStatus.INIT,
    error: '',
  },
  // multisigAccountData is used to store the multisigAccount details when user imports an
  // on chain multisig account
  multisigAccountData: {
    account: {
      account: {
        '@type': '',
        account_number: '',
        address: '',
        pub_key: {},
        sequence: '',
      },
    },
    status: TxStatus.INIT,
    error: '',
  },
  verifyDialogOpen: false,
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
        return rejectWithValue({
          message: error?.response?.data?.message || ERR_UNKNOWN,
        });
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
      const salt = getRandomNumber(MIN_SALT_VALUE, MAX_SALT_VALUE);
      try {
        await multisigService.verifyUser({
          address: data.address,
          signature: token.signature,
          salt: salt,
          pubKey: JSON.stringify(token.pub_key),
        });

        return {
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

export const deleteMultisig = createAsyncThunk(
  'multisig/deleteMultisig',
  async (data: DeleteMultisigInputs, { rejectWithValue }) => {
    try {
      const response = await multisigService.deleteMultisig(
        data.queryParams,
        data.data.address
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
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
        data.baseURLs,
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

export const createTxn = createAsyncThunk(
  'multisig/createTxn',
  async (data: CreateTxnInputs, { rejectWithValue }) => {
    try {
      const response = await multisigService.createTxn(
        data.queryParams,
        data.data.address,
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

export const getTxns = createAsyncThunk(
  'multisig/getTxns',
  async (data: GetTxnsInputs, { rejectWithValue }) => {
    try {
      const response = await multisigService.getTxns(data.address, data.status);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const getAccountAllMultisigTxns = createAsyncThunk(
  'multisig/getAccountAllMultisigTxns',
  async (data: GetTxnsInputs, { rejectWithValue }) => {
    try {
      const response = await multisigService.getAccountAllMultisigTxns(
        data.address,
        data.status
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const updateTxn = createAsyncThunk(
  'multisig/updateTxn',
  async (data: UpdateTxnInputs, { rejectWithValue }) => {
    try {
      const response = await multisigService.updateTx(
        data.queryParams,
        data.data.address,
        data.data.txId,
        data.data.body
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const signTx = createAsyncThunk(
  'multisig/signTx',
  async (data: SignTxInputs, { rejectWithValue }) => {
    try {
      const response = await multisigService.signTx(
        data.queryParams,
        data.data.address,
        data.data.txId,
        {
          signer: data.data.signer,
          signature: data.data.signature,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const importMultisigAccount = createAsyncThunk(
  'multisig/importMultisigAccount',
  async (
    data: {
      baseURLs: string[];
      accountAddress: string;
      multisigAddress: string;
      addressPrefix: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.accountInfo(
        data.baseURLs,
        data.multisigAddress
      );
      if (response?.status === 200) {
        if (
          get(response, 'data.account.pub_key.@type') ===
          MULTISIG_LEGACY_AMINO_PUBKEY_TYPE
        ) {
          if (
            !isMultisigAccountMember(
              data.accountAddress,
              get(response, 'data.account.pub_key.public_keys', []),
              data.addressPrefix
            )
          ) {
            return rejectWithValue(NOT_MULTISIG_MEMBER_ERROR);
          }
        } else {
          return rejectWithValue(NOT_MULTISIG_ACCOUNT_ERROR);
        }
      }
      return response.data;
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || error?.message || ERR_UNKNOWN;
      return rejectWithValue(errorMsg);
    }
  }
);

export const multisigSlice = createSlice({
  name: 'multisig',
  initialState,
  reducers: {
    resetCreateMultisigRes: (state) => {
      state.createMultisigAccountRes = initialState.createMultisigAccountRes;
    },
    resetCreateTxnState: (state) => {
      state.createTxnRes = initialState.createTxnRes;
    },
    resetDeleteTxnState: (state) => {
      state.deleteTxnRes = initialState.deleteTxnRes;
    },
    resetUpdateTxnState: (state) => {
      state.updateTxnRes = initialState.updateTxnRes;
    },
    resetSignTxnState: (state) => {
      state.signTxRes = initialState.signTxRes;
    },
    resetVerifyAccountRes: (state) => {
      state.verifyAccountRes = initialState.verifyAccountRes;
    },
    resetDeleteMultisigRes: (state) => {
      state.deleteMultisigRes = initialState.deleteMultisigRes;
    },
    resetMultisigAccountData: (state) => {
      state.multisigAccountData = initialState.multisigAccountData;
    },
    setVerifyDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.verifyDialogOpen = action.payload;
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
      .addCase(deleteMultisig.pending, (state) => {
        state.deleteMultisigRes = {
          status: TxStatus.PENDING,
          error: '',
        };
      })
      .addCase(deleteMultisig.fulfilled, (state) => {
        state.deleteMultisigRes = {
          status: TxStatus.IDLE,
          error: '',
        };
      })
      .addCase(deleteMultisig.rejected, (state, action) => {
        const payload = action.payload as { message: string };
        state.deleteMultisigRes = {
          status: TxStatus.REJECTED,
          error: payload.message || '',
        };
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
    builder
      .addCase(createTxn.pending, (state) => {
        state.createTxnRes.status = TxStatus.PENDING;
        state.createTxnRes.error = '';
      })
      .addCase(createTxn.fulfilled, (state) => {
        state.createTxnRes.status = TxStatus.IDLE;
        state.createTxnRes.error = '';
      })
      .addCase(createTxn.rejected, (state, action) => {
        state.createTxnRes.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.createTxnRes.error = payload.message || '';
      });
    builder
      .addCase(updateTxn.pending, (state) => {
        state.updateTxnRes.status = TxStatus.PENDING;
      })
      .addCase(updateTxn.fulfilled, (state) => {
        state.updateTxnRes.status = TxStatus.IDLE;
      })
      .addCase(updateTxn.rejected, (state, action) => {
        state.updateTxnRes.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.updateTxnRes.error = payload.message || '';
      });
    builder
      .addCase(getTxns.pending, (state) => {
        state.txns.status = TxStatus.PENDING;
        state.txns.error = '';
        state.txns.list = [];
      })
      .addCase(getTxns.fulfilled, (state, action) => {
        state.txns.status = TxStatus.IDLE;
        state.txns.error = '';
        state.txns.list = action.payload?.data || [];
      })
      .addCase(getTxns.rejected, (state, action) => {
        state.txns.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.txns.error = payload.message || '';
      });
    builder
      .addCase(getAccountAllMultisigTxns.pending, (state) => {
        state.txns.status = TxStatus.PENDING;
        state.txns.error = '';
        state.txns.list = [];
      })
      .addCase(getAccountAllMultisigTxns.fulfilled, (state, action) => {
        state.txns.status = TxStatus.IDLE;
        state.txns.error = '';
        state.txns.list = action.payload?.data || [];
      })
      .addCase(getAccountAllMultisigTxns.rejected, (state, action) => {
        state.txns.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.txns.error = payload.message || '';
      });
    builder
      .addCase(signTx.pending, (state) => {
        state.signTxRes.status = TxStatus.PENDING;
      })
      .addCase(signTx.fulfilled, (state) => {
        state.signTxRes.status = TxStatus.IDLE;
      })
      .addCase(signTx.rejected, (state, action) => {
        state.signTxRes.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.signTxRes.error = payload.message || '';
      });
    builder
      .addCase(importMultisigAccount.pending, (state) => {
        state.multisigAccountData.status = TxStatus.PENDING;
        state.multisigAccountData.error = '';
      })
      .addCase(importMultisigAccount.fulfilled, (state, action) => {
        state.multisigAccountData.status = TxStatus.IDLE;
        state.multisigAccountData.error = '';
        state.multisigAccountData.account =
          action.payload as ImportMultisigAccountRes;
      })
      .addCase(importMultisigAccount.rejected, (state, action) => {
        state.multisigAccountData.status = TxStatus.REJECTED;
        state.multisigAccountData.error =
          typeof action.payload === 'string' ? action.payload : '';
      });
  },
});

export const {
  resetCreateMultisigRes,
  resetCreateTxnState,
  resetDeleteTxnState,
  resetUpdateTxnState,
  resetSignTxnState,
  resetVerifyAccountRes,
  resetDeleteMultisigRes,
  resetMultisigAccountData,
  setVerifyDialogOpen,
} = multisigSlice.actions;

export default multisigSlice.reducer;
