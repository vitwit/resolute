import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authzService from "./service";
import {
  AuthzSendGrantMsg,
  AuthzGenericGrantMsg,
  AuthzRevokeMsg,
  AuthzExecSendMsg,
  AuthzExecVoteMsg,
  AuthzExecWithdrawRewardsMsg,
  AuthzExecDelegateMsg,
  AuthzExecReDelegateMsg,
  AuthzExecUnDelegateMsg,
} from "../../txns/authz";
import { setError, setTxHash } from "../common/commonSlice";
import {
  AuthzExecMsgFeegrant,
  AuthzExecMsgRevoke,
  AuthzExecMsgUnjail,
} from "../../txns/authz/exec";
import { signAndBroadcast } from "../../utils/signing";
import { getAuthzTabs } from "../../utils/authorizations";
import { AuthzFeegrantRevokeMsg } from "../../txns/feegrant/revoke";
import { FeegrantBasicMsg, FeegrantPeriodicMsg } from "../../txns/feegrant";
import { FeegrantFilterMsg } from "../../txns/feegrant/grant";

const initialState = {
  tabResetStatus: false,
  tabs: {
    airdropEnabled: false,
    authzEnabled: false,
    daosEnabled: false,
    feegrantEnabled: false,
    govEnabled: false,
    multisigEnabled: false,
    sendEnabled: false,
    stakingEnabled: false,
  },
  grantsToMe: {},
  grantsByMe: {},
  tx: {
    status: "idle",
  },
  execTx: {
    status: "init",
  },
  selected: {
    granter: "",
  },
  txAuthzRes: {},
};

export const getGrantsToMe = createAsyncThunk(
  "authz/grantsToMe",
  async (data) => {
    const response = await authzService.grantsToMe(
      data.baseURL,
      data.grantee,
      data.pagination
    );
    return {
      chainID: data.chainID,
      data: response.data,
    };
  }
);

export const getGrantsByMe = createAsyncThunk(
  "authz/grantsByMe",
  async (data) => {
    const response = await authzService.grantsByMe(
      data.baseURL,
      data.granter,
      data.pagination
    );
    return {
      chainID: data.chainID,
      data: response.data,
    };
  }
);

export const txAuthzSend = createAsyncThunk(
  "authz/tx-send",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = AuthzSendGrantMsg(
        data.granter,
        data.grantee,
        data.denom,
        data.spendLimit,
        data.expiration
      );
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txAuthzRevoke = createAsyncThunk(
  "authz/tx-revoke",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = AuthzRevokeMsg(data.granter, data.grantee, data.typeURL);
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        dispatch(
          getGrantsByMe({
            baseURL: data.baseURL,
            granter: data.granter,
            chainID: data.chainID,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const authzExecHelper = (dispatch, data) => {
  switch (data.type) {
    case "send": {
      const msg = AuthzExecSendMsg(
        data.from,
        data.granter,
        data.recipient,
        data.amount,
        data.denom
      );
      dispatch(
        txAuthzExec({
          msgs: [msg],
          denom: data.denom,
          rest: data.rest,
          aminoConfig: data.aminoConfig,
          feeAmount: data.feeAmount,
          prefix: data.prefix,
          chainId: data.chainId,
          feegranter: data.feegranter,
        })
      );
      break;
    }
    case "vote": {
      const msg = AuthzExecVoteMsg(
        data.from,
        data.proposalId,
        data.option,
        data.granter
      );
      dispatch(
        txAuthzExec({
          msgs: [msg],
          denom: data.denom,
          rpc: data.rpc,
          rest: data.rest,
          aminoConfig: data.aminoConfig,
          feeAmount: data.feeAmount,
          prefix: data.prefix,
          chainId: data.chainId,
          feegranter: data.feegranter,
          metadata: data.metadata,
        })
      );
      break;
    }
    case "withdraw": {
      const msgs = AuthzExecWithdrawRewardsMsg(data.from, data.payload);
      dispatch(
        txAuthzExec({
          msgs: [msgs],
          denom: data.denom,
          rpc: data.rpc,
          rest: data.rest,
          aminoConfig: data.aminoConfig,
          feeAmount: data.feeAmount,
          prefix: data.prefix,
          chainId: data.chainId,
          feegranter: data.feegranter,
        })
      );
      break;
    }
    case "delegate": {
      const msg = AuthzExecDelegateMsg(
        data.address,
        data.delegator,
        data.validator,
        data.amount,
        data.denom
      );
      dispatch(
        txAuthzExec({
          msgs: [msg],
          denom: data.denom,
          rest: data.rest,
          aminoConfig: data.aminoConfig,
          feeAmount: data.feeAmount,
          prefix: data.prefix,
          chainId: data.chainId,
          feegranter: data.feegranter,
        })
      );
      break;
    }
    case "redelegate": {
      const msg = AuthzExecReDelegateMsg(
        data.address,
        data.delegator,
        data.srcVal,
        data.destVal,
        data.amount,
        data.denom
      );
      dispatch(
        txAuthzExec({
          msgs: [msg],
          denom: data.denom,
          rest: data.rest,
          aminoConfig: data.aminoConfig,
          feeAmount: data.feeAmount,
          prefix: data.prefix,
          chainId: data.chainId,
          feegranter: data.feegranter,
        })
      );
      break;
    }
    case "undelegate": {
      const msg = AuthzExecUnDelegateMsg(
        data.address,
        data.delegator,
        data.validator,
        data.amount,
        data.denom
      );
      dispatch(
        txAuthzExec({
          msgs: [msg],
          denom: data.denom,
          rest: data.rest,
          aminoConfig: data.aminoConfig,
          feeAmount: data.feeAmount,
          prefix: data.prefix,
          chainId: data.chainId,
          feegranter: data.feegranter,
        })
      );
      break;
    }
    case "unjail":
      {
        const msg = AuthzExecMsgUnjail(data.validator, data.from);
        dispatch(
          txAuthzExec({
            msgs: [msg],
            denom: data.denom,
            rest: data.rest,
            aminoConfig: data.aminoConfig,
            feeAmount: data.feeAmount,
            prefix: data.prefix,
            chainId: data.chainId,
            feegranter: data.feegranter,
          })
        );
      }
      break;
    case "revoke": {
      const feegrantRevokeMsg = AuthzFeegrantRevokeMsg(
        data.granter,
        data.grantee
      );
      const msg = AuthzExecMsgRevoke(feegrantRevokeMsg, data.from);
      dispatch(
        txAuthzExec({
          msgs: [msg],
          denom: data.denom,
          rest: data.rest,
          aminoConfig: data.aminoConfig,
          feeAmount: data.feeAmount,
          prefix: data.prefix,
          chainId: data.chainId,
          feegranter: data.feegranter,
        })
      );
      break;
    }
    case "feegrantBasic": {
      const feegrantBasicMsg = FeegrantBasicMsg(
        data.granter,
        data.grantee,
        data.denom,
        data.spendLimit,
        data.expiration,
        true
      );
      const msg = AuthzExecMsgFeegrant(feegrantBasicMsg, data.from);
      dispatch(
        txAuthzExec({
          msgs: [msg],
          denom: data.denom,
          rest: data.rest,
          aminoConfig: data.aminoConfig,
          feeAmount: data.feeAmount,
          prefix: data.prefix,
          chainId: data.chainId,
          feegranter: data.feegranter,
        })
      );
      break;
    }
    case "feegrantPeriodic": {
      const feegrantPeriodicMsg = FeegrantPeriodicMsg(
        data.granter,
        data.grantee,
        data.denom,
        data.spendLimit,
        data.period,
        data.periodSpendLimit,
        data.expiration,
        true
      );
      const msg = AuthzExecMsgFeegrant(feegrantPeriodicMsg, data.from);
      dispatch(
        txAuthzExec({
          msgs: [msg],
          denom: data.denom,
          rest: data.rest,
          aminoConfig: data.aminoConfig,
          feeAmount: data.feeAmount,
          prefix: data.prefix,
          chainId: data.chainId,
          feegranter: data.feegranter,
        })
      );
      break;
    }
    case "feegrantFiltered": {
      const feegrantFilteredMsg = FeegrantFilterMsg(
        data.granter,
        data.grantee,
        data.denom,
        data.spendLimit,
        data.period,
        data.periodSpendLimit,
        data.expiration,
        data.txType || [],
        data.allowanceType,
        true
      );
      const msg = AuthzExecMsgFeegrant(feegrantFilteredMsg, data.from);
      dispatch(
        txAuthzExec({
          msgs: [msg],
          denom: data.denom,
          rest: data.rest,
          aminoConfig: data.aminoConfig,
          feeAmount: data.feeAmount,
          prefix: data.prefix,
          chainId: data.chainId,
          feegranter: data.feegranter,
        })
      );
      break;
    }
    default:
      alert("not supported");
  }
};

export const txAuthzGeneric = createAsyncThunk(
  "authz/tx-generic",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = AuthzGenericGrantMsg(
        data.granter,
        data.grantee,
        data.typeUrl,
        data.expiration
      );
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const txAuthzExec = createAsyncThunk(
  "authz/tx-exec",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        data.msgs,
        260000,
        data?.metadata || "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const authzSlice = createSlice({
  name: "authz",
  initialState,
  reducers: {
    setSelectedGranter: (state, data) => {
      state.selected.granter = data.payload.granter;
    },
    exitAuthzMode: (state) => {
      state.selected.granter = "";
    },
    resetAlerts: (state) => {
      state.tx = {
        status: "idle",
      };
      state.grantsToMe = {
        status: "idle",
        errMsg: "",
      };
      state.grantsByMe = {
        status: "idle",
        errMsg: "",
      };
      state.execTx.status = "init";
    },
    resetExecTx: (state) => {
      state.execTx.status = "init";
    },
    resetTxAuthzRes: (state) => {
      state.txAuthzRes = {};
    },
    resetTabs: (state) => {
      state.tabs = { ...initialState.tabs };
      state.tabResetStatus = true;
    },
    resetTabResetStatus: (state) => {
      state.tabResetStatus = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGrantsToMe.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID || "";
        if (chainID.length) {
          let result = {
            status: "pending",
            errMsg: "",
            grants: [],
            pagination: {},
          };
          state.grantsToMe[chainID] = result;
        }
      })
      .addCase(getGrantsToMe.fulfilled, (state, action) => {
        const chainID = action.payload?.chainID || "";
        const { changeAuthzTab } = action.meta?.arg;

        if (chainID?.length) {
          let grants = action.payload.data.grants;
          if (changeAuthzTab) {
            const existingTabs = state.tabs;
            const updatedTabs = getAuthzTabs(grants);
            for (let tabIndex in updatedTabs) {
              updatedTabs[tabIndex] =
                updatedTabs[tabIndex] || existingTabs[tabIndex];
            }
            state.tabs = updatedTabs;
          }
          let result = {
            status: "idle",
            errMsg: "",
            grants: grants,
            pagination: action.payload.data.pagination,
          };
          state.grantsToMe[chainID] = result;
        }
      })
      .addCase(getGrantsToMe.rejected, (state, action) => {
        const chainID = action.meta.arg.chainID;
        if (chainID.length) {
          state.grantsToMe[chainID].status = "rejected";
          state.grantsToMe[chainID].grants = [];
          state.grantsToMe[chainID].pagination = {};
          state.grantsToMe[chainID].errMsg = action.error.message;
        }
      });

    builder
      .addCase(getGrantsByMe.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID || "";
        if (chainID.length) {
          let result = {
            status: "pending",
            errMsg: "",
            grants: [],
            pagination: {},
          };
          state.grantsByMe[chainID] = result;
        }
      })
      .addCase(getGrantsByMe.fulfilled, (state, action) => {
        const chainID = action.payload.chainID;
        let result = {
          status: "idle",
          errMsg: "",
          grants: action.payload.data.grants,
          pagination: action.payload.data.pagination,
        };
        state.grantsByMe[chainID] = result;
      })
      .addCase(getGrantsByMe.rejected, (state, action) => {
        const chainID = action.meta.arg.chainID;
        if (chainID?.length) {
          state.grantsByMe[chainID].status = "rejected";
          state.grantsByMe[chainID].grants = [];
          state.grantsByMe[chainID].pagination = {};
          state.grantsByMe[chainID].errMsg = action.error.message;
        }
      });

    builder
      .addCase(txAuthzSend.pending, (state) => {
        state.tx.status = `pending`;
        state.txAuthzRes.status = `pending`;
      })
      .addCase(txAuthzSend.fulfilled, (state, _) => {
        state.tx.status = `idle`;
        state.txAuthzRes.status = `idle`;
      })
      .addCase(txAuthzSend.rejected, (state, _) => {
        state.tx.status = `rejected`;
        state.txAuthzRes.status = `rejected`;
      });

    builder
      .addCase(txAuthzGeneric.pending, (state) => {
        state.tx.status = `pending`;
        state.txAuthzRes.status = `pending`;
      })
      .addCase(txAuthzGeneric.fulfilled, (state, _) => {
        state.tx.status = `idle`;
        state.txAuthzRes.status = `idle`;
      })
      .addCase(txAuthzGeneric.rejected, (state, _) => {
        state.tx.status = `rejected`;
        state.txAuthzRes.status = `rejected`;
      });

    builder
      .addCase(txAuthzRevoke.pending, (state) => {
        state.tx.status = `pending`;
        state.txAuthzRes.status = `pending`;
      })
      .addCase(txAuthzRevoke.fulfilled, (state, _) => {
        state.tx.status = `idle`;
        state.txAuthzRes.status = `idle`;
      })
      .addCase(txAuthzRevoke.rejected, (state, _) => {
        state.tx.status = `rejected`;
        state.txAuthzRes.status = `rejected`;
      });

    builder
      .addCase(txAuthzExec.pending, (state) => {
        state.execTx.status = `pending`;
      })
      .addCase(txAuthzExec.fulfilled, (state, _) => {
        state.execTx.status = `idle`;
      })
      .addCase(txAuthzExec.rejected, (state, _) => {
        state.execTx.status = `rejected`;
      });
  },
});

export const {
  resetAlerts,
  setSelectedGranter,
  resetExecTx,
  resetTxAuthzRes,
  resetTabs,
  exitAuthzMode,
  resetTabResetStatus,
} = authzSlice.actions;

export default authzSlice.reducer;
