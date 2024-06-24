'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SendMsg } from '../../../txns/bank';
import bankService from './bankService';
import { signAndBroadcast } from '../../../utils/signing';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { GAS_FEE } from '../../../utils/constants';
import { TxStatus } from '../../../types/enums';
import { ERR_UNKNOWN } from '@/utils/errors';
import { NewTransaction } from '@/utils/transaction';
import { setTxAndHash } from '../common/commonSlice';
import cloneDeep from 'lodash/cloneDeep';

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
  authz: {
    balancesLoading: number;
    balances: { [key: string]: Balance };
    tx: {
      status: TxStatus;
    };
    multiSendTx: {
      status: TxStatus;
    };
  };
  showIBCSendAlert: boolean;
}

const initialState: BankState = {
  balancesLoading: 0,
  balances: {},
  tx: {
    status: TxStatus.INIT,
  },
  multiSendTx: { status: TxStatus.INIT },
  authz: {
    balancesLoading: 0,
    balances: {},
    tx: {
      status: TxStatus.INIT,
    },
    multiSendTx: { status: TxStatus.INIT },
  },
  showIBCSendAlert: false,
};

export const getBalances = createAsyncThunk(
  'bank/balances',
  async (data: {
    baseURLs: string[];
    baseURL: string;
    address: string;
    chainID: string;
    pagination?: KeyLimitPagination;
  }) => {
    const response = await bankService.balances(
      data.baseURLs,
      data.address,
      data.chainID,
      data.pagination
    );
    return {
      chainID: data.chainID,
      data: response.data,
    };
  }
);

export const getAuthzBalances = createAsyncThunk(
  'bank/authz-balances',
  async (data: {
    baseURLs: string[];
    baseURL: string;
    address: string;
    chainID: string;
    pagination?: KeyLimitPagination;
  }) => {
    const response = await bankService.balances(
      data.baseURLs,
      data.address,
      data.chainID,
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
  async (
    data: MultiTxnsInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    const { chainID, prefix, aminoConfig, feeAmount, address, rest, restURLs } =
      data.basicChainInfo;
    try {
      const result = await signAndBroadcast(
        chainID,
        aminoConfig,
        prefix,
        data.msgs,
        GAS_FEE,
        data.memo,
        `${feeAmount}${data.denom}`,
        rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined,
        '',
        restURLs
      );
      const tx = NewTransaction(result, data.msgs, chainID, address);
      dispatch(setTxAndHash({ tx, hash: tx.transactionHash }));
      if (result?.code === 0) {
        dispatch(
          getBalances({
            baseURL: rest,
            chainID,
            address,
            baseURLs: restURLs,
          })
        );
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
    data: TxSendInputs | TxAuthzExecInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    const { chainID } = data.basicChainInfo;

    try {
      let msgs: Msg[] = [];

      if (data.isAuthzMode) {
        msgs = data.msgs;
      } else {
        msgs = [SendMsg(data.from, data.to, data.amount, data.denom)];
      }

      let result;

      try {
        result = await signAndBroadcast(
          data.basicChainInfo.chainID,
          data.basicChainInfo.aminoConfig,
          data.basicChainInfo.prefix,
          msgs,
          GAS_FEE,
          data.memo,
          `${data.basicChainInfo.feeAmount * 10 ** data.basicChainInfo.decimals}${
            data.denom
          }`,
          data.basicChainInfo.rest,
          data.feegranter,
          data?.basicChainInfo?.rpc,
          data?.basicChainInfo?.restURLs
        );
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      } catch (error: any) {
        return rejectWithValue(error?.message);
      }

      const tx = NewTransaction(
        result,
        msgs,
        chainID,
        data.basicChainInfo.address
      );
      dispatch(setTxAndHash({ tx, hash: tx.transactionHash }));
      if (result?.code === 0) {
        if (data.isAuthzMode) {
          dispatch(
            getAuthzBalances({
              baseURLs: data.basicChainInfo.restURLs,
              baseURL: data.basicChainInfo.rest,
              chainID,
              address: data.authzChainGranter,
            })
          );
        } else {
          dispatch(
            getBalances({
              baseURLs: data.basicChainInfo.restURLs,
              baseURL: data.basicChainInfo.rest,
              chainID,
              address: data.basicChainInfo.address,
            })
          );
        }

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
    resetState: (state) => {
      /* eslint-disable-next-line */
      state = cloneDeep(initialState);
    },
    resetAuthz: (state) => {
      state.authz = {
        balancesLoading: 0,
        balances: {},
        tx: {
          status: TxStatus.INIT,
        },
        multiSendTx: { status: TxStatus.INIT },
      };
    },
    setIBCSendAlert: (state, action: PayloadAction<boolean>) => {
      state.showIBCSendAlert = action.payload;
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
      .addCase(getAuthzBalances.pending, (state, action) => {
        const chainID = action.meta.arg.chainID;
        if (!state.authz.balances[chainID]) {
          state.authz.balances[chainID] = {
            list: [],
            status: TxStatus.INIT,
            errMsg: '',
          };
        }
        state.authz.balances[chainID].status = TxStatus.PENDING;
        state.authz.balancesLoading++;
      })
      .addCase(getAuthzBalances.fulfilled, (state, action) => {
        const chainID = action.meta.arg.chainID;

        const result = {
          list: action.payload.data?.balances,
          status: TxStatus.IDLE,
          errMsg: '',
        };
        state.authz.balances[chainID] = result;
        state.authz.balancesLoading--;
      })
      .addCase(getAuthzBalances.rejected, (state, action) => {
        const chainID = action.meta.arg.chainID;
        state.authz.balances[chainID] = {
          status: TxStatus.REJECTED,
          errMsg: action?.error?.message || ERR_UNKNOWN,
          list: [],
        };
        state.authz.balancesLoading--;
      });

    builder
      .addCase(txBankSend.pending, (state) => {
        state.tx.status = TxStatus.PENDING;
      })
      .addCase(txBankSend.fulfilled, (state, action) => {
        state.tx.status = TxStatus.IDLE;
        action.meta.arg?.onTxSuccessCallBack?.();
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

export const {
  claimRewardInBank,
  resetMultiSendTxRes,
  resetState,
  resetAuthz,
  setIBCSendAlert,
} = bankSlice.actions;
export default bankSlice.reducer;
