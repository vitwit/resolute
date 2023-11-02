import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SendMsg } from "../../../txns/bank";
import bankService from "./bankService";
import { signAndBroadcast } from "../../../utils/signing";

interface BankState {
  balances: Record<string, any>;
  tx: {
    status: "" | "idle" | "pending" | "rejected";
  };
  multiSendTx: {
    status: "" | "idle" | "pending" | "rejected";
  };
}

const initialState: BankState = {
  balances: {},
  tx: {
    status: "",
  },
  multiSendTx: { status: "" },
};

export const getBalances = createAsyncThunk(
  "bank/balances",
  async (data: {
    baseURL: string;
    address: string;
    chainID: string;
    pagination: any;
  }) => {
    const response = await bankService.balances(
      data.baseURL,
      data.address,
      data.pagination
    );
    return {
      chainID: data.chainID,
      data: response.data,
    };
  }
);

export const multiTxns = createAsyncThunk(
  "bank/multi-txs",
  async (
    data: {
      baseURL: string;
      address: string;
      chainID: string;
      pagination: any;
      aminoConfig: any;
      prefix: any;
      msgs: any[];
      memo: string;
      feeAmount: number;
      denom: string;
      feegranter: string;
      rest: string;
    },
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const result = await signAndBroadcast(
        data.chainID,
        data.aminoConfig,
        data.prefix,
        data.msgs,
        860000,
        data.memo,
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const txBankSend = createAsyncThunk(
  "bank/tx-bank-send",
  async (
    data: {
      baseURL: string;
      address: string;
      from: string;
      to: string;
      amount: number;
      chainID: string;
      pagination: any;
      aminoConfig: any;
      prefix: any;
      feeAmount: number;
      denom: string;
      feegranter: string;
      rest: string;
    },
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const msg = SendMsg(data.from, data.to, data.amount, data.denom);
      const result = await signAndBroadcast(
        data.chainID,
        data.aminoConfig,
        data.prefix,
        [msg],
        860000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {
    claimRewardInBank: (state: any, action) => {
      const { chainID, totalRewards, minimalDenom } = action.payload;
      for (let i = 0; i < state?.balances?.[chainID]?.list?.length; i++) {
        if (state.balances[chainID]?.list?.[i]?.denom === minimalDenom) {
          state.balances[chainID].list[i].amount =
            +state.balances[chainID].list[i].amount + totalRewards;
        }
      }
    },
    resetMultiSendTxRes: (state) => {
      state.multiSendTx = { status: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBalances.pending, (state: any, action) => {
        const chainID = action.meta.arg.chainID;
        state.balances[chainID] = "pending";
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        const chainID = action.payload.chainID;

        let result = {
          list: action.payload.data?.balances,
          status: "idle",
          errMsg: "",
        };
        state.balances[chainID] = result;
      })
      .addCase(getBalances.rejected, (state: any, action) => {
        const chainID = action.meta.arg.chainID;
        state.balances[chainID] = {
          status: "idle",
          errMsg:
            action?.error?.message || "requested rejected for unknown reason",
          list: [],
        };
      })

      .addCase(txBankSend.pending, (state: BankState) => {
        state.tx.status = "pending";
      })
      .addCase(txBankSend.fulfilled, (state: BankState, _) => {
        state.tx.status = "idle";
      })
      .addCase(txBankSend.rejected, (state: BankState, _) => {
        state.tx.status = "rejected";
      })
      .addCase(multiTxns.pending, (state: BankState) => {
        state.tx.status = "pending";
        state.multiSendTx.status = "pending";
      })
      .addCase(multiTxns.fulfilled, (state: BankState, _) => {
        state.tx.status = "idle";
        state.multiSendTx.status = "idle";
      })
      .addCase(multiTxns.rejected, (state: BankState, _) => {
        state.tx.status = "rejected";
        state.multiSendTx.status = "rejected";
      });
  },
});

export const { claimRewardInBank, resetMultiSendTxRes } = bankSlice.actions;
export default bankSlice.reducer;
