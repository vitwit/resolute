import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import multisigService from "./multisigService";
import bankService from "../bank/service";
import { SignMsg } from "../../txns/multisig/verify";
import { setError } from "../common/commonSlice";

export const SOMETHING_WRONG = "Something went wrong";

const initialState = {
  createMultisigAccountRes: {
    status: "",
    error: "",
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
  multisigAccount: {
    account: {},
    pubkeys: [],
    status: "idle",
    error: "",
  },
  deleteTxnRes: {
    status: "",
    error: "",
  },
  updateTxn: {
    status: "",
    error: "",
  },
  balance: {
    balance: {},
    status: "idle",
    errMsg: "",
  },
  verifyAccountRes: {
    token: "",
    status: "",
    error: "",
  },
};

export const createAccount = createAsyncThunk(
  "multisig/createAccount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await multisigService.createAccount(
        data.queryParams,
        data.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
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
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
    }
  }
);

export const deleteTxn = createAsyncThunk(
  "multisig/deleteTxn",
  async (data, { rejectWithValue }) => {
    try {
      const response = await multisigService.deleteTx(
        data.queryParams,
        data.data.address,
        data.data.id
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
    }
  }
);

export const multisigByAddress = createAsyncThunk(
  "multisig/multisigByAddress",
  async (address, { rejectWithValue }) => {
    try {
      const response = await multisigService.getAccount(address);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
    }
  }
);

export const getMultisigBalance = createAsyncThunk(
  "multisig/multisigBalance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await bankService.balance(
        data.baseURL,
        data.address,
        data.denom
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
    }
  }
);

export const createTxn = createAsyncThunk(
  "multisig/createTxn",
  async (data, { rejectWithValue }) => {
    try {
      const response = await multisigService.createTxn(
        data.queryParams,
        data.data.address,
        data.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
    }
  }
);

export const updateTxn = createAsyncThunk(
  "multisig/updateTxn",
  async ({ queryParams, data }, { rejectWithValue }) => {
    console.log(queryParams, data);
    try {
      const response = await multisigService.updateTx(
        queryParams,
        data.address,
        data.txId,
        data.body
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
    }
  }
);

export const getTxns = createAsyncThunk(
  "multisig/getTxns",
  async ({ address, status }, { rejectWithValue }) => {
    try {
      const response = await multisigService.getTxns(address, {
        status: status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
    }
  }
);

export const signTx = createAsyncThunk(
  "multisig/signTx",
  async (data, { rejectWithValue }) => {
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
      return rejectWithValue(
        error?.response?.data?.message || error?.message || SOMETHING_WRONG
      );
    }
  }
);

export const verifyAccount = createAsyncThunk(
  "multisig/verifyAccount",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const token = await window.wallet.signArbitrary(
        data.chainID,
        data.address,
        JSON.stringify(SignMsg(data.address))
      );
      const salt = new Date().getTime();
      try {
        const response = await multisigService.verifyUser({
          address: data.address,
          signature: token.signature,
          salt: 10,
          pubKey: JSON.stringify(token.pub_key),
        });
        return {
          response: response,
          token: token,
        };
      } catch (error) {
        return rejectWithValue(
          error?.response?.data?.message || error?.message || SOMETHING_WRONG
        );
      }
    } catch (error) {
      dispatch(
        setError({
          type: "error",
          message: error.message || "",
        })
      );
      return rejectWithValue("Wallet connection request rejected");
    }
  }
);

export const multiSlice = createSlice({
  name: "multisig",
  initialState,
  reducers: {
    resetCreateMultisigRes: (state, _) => {
      state.createMultisigAccountRes = initialState.createMultisigAccountRes;
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
    resetVerifyAccountRes: (state, _) => {
      state.verifyAccountRes = initialState.verifyAccountRes;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.createMultisigAccountRes.status = "pending";
        state.createMultisigAccountRes.error = "";
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.createMultisigAccountRes.status = "idle";
        state.createMultisigAccountRes.error = "";
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.createMultisigAccountRes.status = "rejected";
        state.createMultisigAccountRes.error = action.payload;
      });

    builder
      .addCase(getMultisigBalance.pending, (state) => {
        state.balance.status = "pending";
        state.balance.error = "";
      })
      .addCase(getMultisigBalance.fulfilled, (state, action) => {
        state.balance.status = "idle";
        state.balance.error = "";
        state.balance.balance = action.payload.balance;
      })
      .addCase(getMultisigBalance.rejected, (state, action) => {
        state.balance.status = "rejected";
        state.balance.error = action.payload;
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
        state.multisigAccount.status = "idle";
      })
      .addCase(multisigByAddress.rejected, (state, action) => {
        state.multisigAccount.status = "rejected";
      });

    builder
      .addCase(createTxn.pending, (state) => {
        state.createTxnRes.status = "pending";
        state.createTxnRes.error = "";
      })
      .addCase(createTxn.fulfilled, (state, result) => {
        state.createTxnRes.status = "idle";
      })
      .addCase(createTxn.rejected, (state, action) => {
        state.createTxnRes.status = "rejected";
        state.createTxnRes.error = action.payload;
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

    builder
      .addCase(verifyAccount.pending, (state) => {
        state.verifyAccountRes.status = "pending";
        state.verifyAccountRes.error = "";
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.verifyAccountRes.token = action.payload.token.signature;
        state.verifyAccountRes.status = "idle";
        state.verifyAccountRes.error = "";
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.verifyAccountRes.status = "rejected";
        state.verifyAccountRes.error = action.payload;
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
