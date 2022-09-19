import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createMultisigAccount,
  createSignature,
  createTransaction,
  deleteTx,
  fetchDelegatorValidators,
  fetchMultisigAccount,
  fetchMultisigAccountByAddress,
  fetchMultisigAccounts,
  fetchSignatures,
  fetchTransactins,
  fetchTransaction,
  updateTransaction,
} from "./multisigService";

export const SOMETHING_WRONG = "Something went wrong";

const initialState = {
  createMultisigAccountRes: {
    status: "",
  },
  multisigAccounts: {
    status: "idle",
    accounts: [],
  },
  createTxnRes: {
    status: "",
    error: "",
  },
  txns: {},
  txn: {},
  createSignRes: {
    status: "",
    error: "",
  },
  signatures: {},
  multisigAccount: {},
  delegatorVals: {},
  updateTxn: {
    status: "",
    error: "",
  },
  deleteTxnRes: {
    status: "",
    error: "",
  },
};

export const createAccount = createAsyncThunk(
  "multisig/createAccount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createMultisigAccount(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getMultisigAccounts = createAsyncThunk(
  "multisig/getMultisigAccounts",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetchMultisigAccounts(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const deleteTxn = createAsyncThunk(
  "multisig/deleteTxn",
  async (data, { rejectWithValue }) => {
    try {
      const response = await deleteTx(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getDelegatorValidators = createAsyncThunk(
  "multisig/getDelegatorValidators",
  async ({ lcdUrl, delegatorAddress }) => {
    const response = await fetchDelegatorValidators(lcdUrl, delegatorAddress);
    return response.data;
  }
);

export const getMultisigAccount = createAsyncThunk(
  "multisig/getMultisigAccount",
  async (data) => {
    const response = await fetchMultisigAccount(data);
    return response.data;
  }
);

export const multisigByAddress = createAsyncThunk(
  "multisig/multisigByAddress",
  async (data) => {
    const response = await fetchMultisigAccountByAddress(data);
    return response.data;
  }
);

export const createTxn = createAsyncThunk(
  "multisig/createTxn",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createTransaction(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const updateTxn = createAsyncThunk(
  "multisig/updateTxn",
  async ({ txId, body }, {rejectWithValue}) => {
    try {
      const response = await updateTransaction({ txId, body });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getTxns = createAsyncThunk(
  "multisig/getTxns",
  async ({ address, status }) => {
    const response = await fetchTransactins(address, status);
    return response.data;
  }
);

export const createSign = createAsyncThunk(
  "multisig/createSign",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createSignature(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getSigns = createAsyncThunk(
  "multisig/getSigns",
  async ({ address, txId }) => {
    const response = await fetchSignatures(address, txId);
    return response.data;
  }
);

export const getSingleTxn = createAsyncThunk(
  "multisig/getSingleTxn",
  async (txId) => {
    const response = await fetchTransaction(txId);
    return response.data;
  }
);

export const multiSlice = createSlice({
  name: "multisig",
  initialState,
  reducers: {
    resetCreateMultisigRes: (state, _) => {
      state.createMultisigAccountRes.status = "";
    },
    resetCreateTxnState: (state, _) => {
      state.createTxnRes = initialState.createTxnRes;
    },
    resetDeleteTxnState: (state, _) => {
      state.deleteTxnRes = initialState.deleteTxnRes;
    },
    resetUpdateTxnState: (state, _) => {
      state.updateTxn = initialState.updateTxn;
    },
    resetSignTxnState: (state, _) => {
      state.createSignRes = initialState.createSignRes;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.createMultisigAccountRes.status = "pending";
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.createMultisigAccountRes.status = "idle";
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.createMultisigAccountRes.status = "rejected";
      });

    builder
      .addCase(getMultisigAccounts.pending, (state) => {
        state.multisigAccounts.status = "pending";
        state.multisigAccounts.accounts = [];
      })
      .addCase(getMultisigAccounts.fulfilled, (state, action) => {
        state.multisigAccounts.accounts = action.payload?.data?.data || [];
        state.multisigAccounts.status = "idle";
      })
      .addCase(getMultisigAccounts.rejected, (state, action) => {
        state.multisigAccounts.status = "rejected";
        state.multisigAccounts.accounts = [];
        state.multisigAccounts.error = action.payload;
      });

    builder
      .addCase(getMultisigAccount.pending, (state) => {
        state.multisigAccount.status = "pending";
      })
      .addCase(getMultisigAccount.fulfilled, (state, action) => {
        state.multisigAccount = action.payload;
      })
      .addCase(getMultisigAccount.rejected, (state, action) => {
        state.multisigAccount.status = "rejected";
      });

    builder
      .addCase(multisigByAddress.pending, (state) => {
        state.multisigAccount.status = "pending";
      })
      .addCase(multisigByAddress.fulfilled, (state, action) => {
        state.multisigAccount = action.payload;
      })
      .addCase(multisigByAddress.rejected, (state, action) => {
        state.multisigAccount.status = "rejected";
      });

    builder
      .addCase(createTxn.pending, (state) => {
        state.createTxnRes.status = "pending";
      })
      .addCase(createTxn.fulfilled, (state, _) => {
        state.createTxnRes.status = "idle";
      })
      .addCase(createTxn.rejected, (state, action) => {
        state.createTxnRes.status = "rejected";
        state.createTxnRes.error = action.payload;
      });

    builder
      .addCase(getTxns.pending, (state) => {
        state.txns.status = "pending";
      })
      .addCase(getTxns.fulfilled, (state, action) => {
        state.txns = action.payload;
      })
      .addCase(getTxns.rejected, (state, action) => {
        state.txns.status = "rejected";
      });

    builder
      .addCase(getSingleTxn.pending, (state) => {
        state.txn.status = "pending";
      })
      .addCase(getSingleTxn.fulfilled, (state, action) => {
        state.txn = action.payload;
      })
      .addCase(getSingleTxn.rejected, (state, action) => {
        state.txn.status = "rejected";
      });

    builder
      .addCase(getSigns.pending, (state) => {
        state.signatures.status = "pending";
      })
      .addCase(getSigns.fulfilled, (state, action) => {
        state.signatures = action.payload;
      })
      .addCase(getSigns.rejected, (state, action) => {
        state.signatures.status = "rejected";
      });

    builder
      .addCase(deleteTxn.pending, (state) => {
        state.deleteTxnRes.status = "pending";
      })
      .addCase(deleteTxn.fulfilled, (state, _) => {
        state.deleteTxnRes.status = "idle";
      })
      .addCase(deleteTxn.rejected, (state, action) => {
        state.deleteTxnRes.status = "rejected";
        state.deleteTxnRes.error = action.payload;
      });

    builder
      .addCase(getDelegatorValidators.pending, (state) => {
        state.delegatorVals.status = "pending";
      })
      .addCase(getDelegatorValidators.fulfilled, (state, action) => {
        state.delegatorVals = action.payload;
      })
      .addCase(getDelegatorValidators.rejected, (state, action) => {
        state.delegatorVals.status = "rejected";
      });

    builder
      .addCase(updateTxn.pending, (state) => {
        state.updateTxn.status = "pending";
      })
      .addCase(updateTxn.fulfilled, (state, _) => {
        state.updateTxn.status = "idle";
      })
      .addCase(updateTxn.rejected, (state, action) => {
        state.updateTxn.status = "rejected";
        state.updateTxn.error = action.payload;
      });

    builder
      .addCase(createSign.pending, (state) => {
        state.createSignRes.status = "pending";
      })
      .addCase(createSign.fulfilled, (state, _) => {
        state.createSignRes.status = "idle";
      })
      .addCase(createSign.rejected, (state, action) => {
        state.createSignRes.status = "rejected";
        state.createSignRes.error = action.payload;
      });
  },
});

export const {
  resetCreateMultisigRes,
  resetCreateTxnState,
  resetDeleteTxnState,
  resetUpdateTxnState,
  resetSignTxnState,
} = multiSlice.actions;

export default multiSlice.reducer;
