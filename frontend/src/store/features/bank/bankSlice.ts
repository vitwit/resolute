'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SendMsg } from '../../../txns/bank';
import bankService from './bankService';
import { signAndBroadcast } from '../../../utils/signing';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { GAS_FEE } from '../../../utils/constants';
import { TxStatus } from '../../../types/enums';
import { ERR_UNKNOWN } from '@/utils/errors';
import { addTransactions } from '../transactionHistory/transactionHistorySlice';
import { NewTransaction } from '@/utils/transaction';
import { setTxAndHash } from '../common/commonSlice';

interface Balance {
  list: Coin[];
  status: TxStatus;
  errMsg: string;
}
interface BankState {
  balancesLoading: number;
  balances: { [key: string]: Balance };
  tx: {
    status: TxStatus;
  };
  multiSendTx: {
    status: TxStatus;
  };
}

const initialState: BankState = {
  balancesLoading: 0,
  balances: {},
  tx: {
    status: TxStatus.INIT,
  },
  multiSendTx: { status: TxStatus.INIT },
};

export const getBalances = createAsyncThunk(
  'bank/balances',
  async (data: {
    baseURL: string;
    address: string;
    chainID: string;
    pagination?: KeyLimitPagination;
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
  'bank/multi-txs',
  async (data: MultiTxnsInputs, { rejectWithValue, fulfillWithValue }) => {
    try {
      const result = await signAndBroadcast(
        data.basicChainInfo.chainID,
        data.basicChainInfo.aminoConfig,
        data.prefix,
        data.msgs,
        GAS_FEE,
        data.memo,
        `${data.feeAmount}${data.denom}`,
        data.basicChainInfo.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const txBankSend = createAsyncThunk(
  'bank/tx-bank-send',
  async (
    data: TxSendInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    const { chainID, cosmosAddress } = data.basicChainInfo;

    try {
      const msg = SendMsg(data.from, data.to, data.amount, data.denom);
      const result = await signAndBroadcast(
        chainID,
        data.basicChainInfo.aminoConfig,
        data.prefix,
        [msg],
        GAS_FEE,
        data.memo,
        `${data.feeAmount}${data.denom}`,
        data.basicChainInfo.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      const tx = NewTransaction(result, [msg], chainID, data.from);
      dispatch(
        addTransactions({
          chainID: data.basicChainInfo.chainID,
          address: cosmosAddress,
          transactions: [tx],
        })
      );
      dispatch(setTxAndHash({ tx, hash: tx.transactionHash }));
      if (result?.code === 0) {
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        return rejectWithValue(result?.rawLog);
      }
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    claimRewardInBank: (state: BankState, action) => {
      const { chainID, totalRewards, minimalDenom } = action.payload;
      for (let i = 0; i < state?.balances?.[chainID]?.list?.length; i++) {
        if (state.balances[chainID]?.list?.[i]?.denom === minimalDenom) {
          state.balances[chainID].list[i].amount =
            +state.balances[chainID].list[i].amount + totalRewards;
        }
      }
    },
    resetMultiSendTxRes: (state) => {
      state.multiSendTx = { status: TxStatus.INIT };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getBalances.pending, (state, action) => {
        const chainID = action.meta.arg.chainID;
        if (!state.balances[chainID]) {
          state.balances[chainID] = {
            list: [],
            status: TxStatus.INIT,
            errMsg: '',
          };
        }
        state.balances[chainID].status = TxStatus.PENDING;
        state.balancesLoading++;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        const chainID = action.meta.arg.chainID;

        const result = {
          list: action.payload.data?.balances,
          status: TxStatus.IDLE,
          errMsg: '',
        };
        state.balances[chainID] = result;
        state.balancesLoading--;
      })
      .addCase(getBalances.rejected, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.balances[chainID] = {
          status: TxStatus.REJECTED,
          errMsg: action?.error?.message || ERR_UNKNOWN,
          list: [],
        };
        state.balancesLoading--;
      });

    builder
      .addCase(txBankSend.pending, (state) => {
        state.tx.status = TxStatus.PENDING;
      })
      .addCase(txBankSend.fulfilled, (state) => {
        state.tx.status = TxStatus.IDLE;
      })
      .addCase(txBankSend.rejected, (state) => {
        state.tx.status = TxStatus.REJECTED;
      });

    builder
      .addCase(multiTxns.pending, (state) => {
        state.tx.status = TxStatus.PENDING;
        state.multiSendTx.status = TxStatus.PENDING;
      })
      .addCase(multiTxns.fulfilled, (state) => {
        state.tx.status = TxStatus.IDLE;
        state.multiSendTx.status = TxStatus.IDLE;
      })
      .addCase(multiTxns.rejected, (state) => {
        state.tx.status = TxStatus.REJECTED;
        state.multiSendTx.status = TxStatus.REJECTED;
      });
  },
});

export const { claimRewardInBank, resetMultiSendTxRes } = bankSlice.actions;
export default bankSlice.reducer;
