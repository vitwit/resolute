import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import multisigService from "./multisigService";

export const SOMETHING_WRONG = "Something went wrong";

const initialState = {
  createMultisigAccountRes: {
    status: "",
  },
  multisigAccounts: {
    status: "idle",
    accounts: [],
    txnCounts: {},
    total: 0,
  },
  createTxnRes: {
    status: "",
    error: "",
  },
  txns: {
    list: [],
    status: "idle",
    errMsg: "",
  },
  txn: {},
  createSignRes: {
    status: "",
    error: "",
  },
  signatures: {},
  multisigAccount: {
    account: {},
    pubkeys: [],
    status: "idle",
    error: "",
  },
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

const x = async () => {};

export const createAccount = createAsyncThunk(
  "multisig/createAccount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await multisigService.createAccount(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getMultisigAccounts = createAsyncThunk(
  "multisig/getMultisigAccounts",
  async (address, { rejectWithValue }) => {
    try {
      const response = await multisigService.getAccounts(address);
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
      const response = await multisigService.deleteTx(data.address, data.id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getDelegatorValidators = createAsyncThunk(
  "multisig/getDelegatorValidators",
  async ({ lcdUrl, delegatorAddress }) => {
    const response = await x();
    return response.data;
  }
);

export const getMultisigAccount = createAsyncThunk(
  "multisig/getMultisigAccount",
  async (data) => {
    const response = await x();
    return response.data;
  }
);

export const multisigByAddress = createAsyncThunk(
  "multisig/multisigByAddress",
  async (address) => {
    const response = await multisigService.getAccount(address);
    return response.data;
  }
);

export const createTxn = createAsyncThunk(
  "multisig/createTxn",
  async (data, { rejectWithValue }) => {
    try {
      const response = await multisigService.createTxn(data.address, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const updateTxn = createAsyncThunk(
  "multisig/updateTxn",
  async ({address, txId, body }, { rejectWithValue }) => {
    try {
      const response = await multisigService.updateTx(address, txId, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getTxns = createAsyncThunk(
  "multisig/getTxns",
  async ({ address, status }) => {
    const response = await multisigService.getTxns(address, {
      status: status,
    });
    return response.data;
  }
);

export const signTx = createAsyncThunk(
  "multisig/signTx",
  async (data, { rejectWithValue }) => {
    try {
      const response = await multisigService.signTx(data.address, data.txId, {
        signer: data.signer,
        signature: data.signature,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || SOMETHING_WRONG);
    }
  }
);

export const getSigns = createAsyncThunk(
  "multisig/getSigns",
  async ({ address, txId }) => {
    const response = await x();
    return response.data;
  }
);

export const getSingleTxn = createAsyncThunk(
  "multisig/getSingleTxn",
  async (txId) => {
    const response = await x();
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
        state.multisigAccounts.total = 0;
        state.multisigAccounts.txnCounts = {};
      })
      .addCase(getMultisigAccounts.fulfilled, (state, action) => {
        state.multisigAccounts.accounts = action.payload?.data?.accounts || [];
        state.multisigAccounts.total = action.payload?.data?.total;
        state.multisigAccounts.txnCounts =
          action.payload?.data?.pending_txns || {};
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
        state.multisigAccount.account = {};
        state.multisigAccount.error = "";
        state.multisigAccount.pubkeys = [];
      })
      .addCase(getMultisigAccount.fulfilled, (state, action) => {
        state.multisigAccount.account = action.payload?.data?.account || {};
        state.multisigAccount.pubkeys = action.payload?.data?.pubkeys || [];
        state.multisigAccount.error = "";
      })
      .addCase(getMultisigAccount.rejected, (state, action) => {
        state.multisigAccount.status = "rejected";
      });

    builder
      .addCase(multisigByAddress.pending, (state) => {
        state.multisigAccount.status = "pending";
        state.multisigAccount.account = {};
        state.multisigAccount.error = "";
        state.multisigAccount.pubkeys = [];
      })
      .addCase(multisigByAddress.fulfilled, (state, action) => {
        state.multisigAccount.account = action.payload?.data?.account || {};
        state.multisigAccount.pubkeys = action.payload?.data?.pubkeys || [];
        state.multisigAccount.error = "";
      })
      .addCase(multisigByAddress.rejected, (state, action) => {
        state.multisigAccount.status = "rejected";
      });

    builder
      .addCase(createTxn.pending, (state) => {
        state.createTxnRes.status = "pending";
      })
      .addCase(createTxn.fulfilled, (state, result) => {
        state.createTxnRes.status = "idle";
      })
      .addCase(createTxn.rejected, (state, action) => {
        state.createTxnRes.status = "rejected";
        state.createTxnRes.error = action.payload?.message;
      });

    builder
      .addCase(getTxns.pending, (state) => {
        state.txns.status = "pending";
        state.txns.errMsg = "";
        state.txns.list = [];
      })
      .addCase(getTxns.fulfilled, (state, action) => {
        state.txns.errMsg = "";
        state.txns.status = "idle";
        state.txns.list = action.payload?.data || [];
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
      .addCase(signTx.pending, (state) => {
        state.createSignRes.status = "pending";
      })
      .addCase(signTx.fulfilled, (state, _) => {
        state.createSignRes.status = "idle";
      })
      .addCase(signTx.rejected, (state, action) => {
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
