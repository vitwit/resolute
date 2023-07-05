import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GovVoteMsg } from "../../txns/gov";
import { signAndBroadcast } from "../../utils/signing";
import { setError, setTxHash } from "../common/commonSlice";
import govService from "./govService";

const initialState = {
  loading : false,
  active: {
    proposals: {},
    status: "idle",
    errMsg: "",
  },
  tally: {
    status: "idle",
    errMsg: "",
    proposalTally: {},
  },
  votes: {
    status: "idle",
    errMsg: "",
    proposals: {},
  },
  tx: {
    status: "",
  },
  proposalInfo: {
    status: "idle",
    error: "",
    proposalInfo: {},
  },
};

export const getProposal = createAsyncThunk(
  "gov/proposal-info",
  async (data, { rejectWithValue }) => {
    try {
      const response = await govService.proposal(data.baseURL, data.proposalId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProposals = createAsyncThunk(
  "gov/active-proposals",
  async (data, { dispatch }) => {
    const response = await govService.proposals(
      data.baseURL,
      data.key,
      data.limit,
      2
    );
    if (response?.data?.proposals?.length > 0) {
      const proposals = response?.data?.proposals;
      for (let i = 0; i < proposals.length; i++) {
        dispatch(
          getProposalTally({
            baseURL: data.baseURL,
            proposalId: proposals[i].proposal_id,
            chainID: data.chainID,
          })
        );

        dispatch(
          getVotes({
            baseURL: data.baseURL,
            proposalId: proposals[i].proposal_id,
            voter: data.voter,
            chainID: data.chainID,
          })
        );
      }
    }
    return {
      chainID: data.chainID,
      data: response.data
    };
  }
);

export const getProposalTally = createAsyncThunk(
  "gov/proposal-tally",
  async (data) => {
    const response = await govService.tally(data.baseURL, data.proposalId);
    response.data.tally.proposal_id = data.proposalId;
    return {
      chainID: data.chainID,
      data: response.data
    };
  }
);

export const getVotes = createAsyncThunk("gov/voter-votes", async (data) => {
  const response = await govService.votes(
    data.baseURL,
    data.proposalId,
    data.voter,
    data.key,
    data.limit
  );
  response.data.vote.proposal_id = data.proposalId;
  return {
    chainID: data.chainID,
    data: response.data
  };
});

export const txVote = createAsyncThunk(
  "gov/tx-vote",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = GovVoteMsg(data.proposalId, data.voter, data.option);
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        data?.justification || "",
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

export const proposalsSlice = createSlice({
  name: "gov",
  initialState,
  reducers: {
    resetLoading: (state) => {
      state.loading = true;
    },
    resetTx: (state) => {
      state.tx = {
        status: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProposals.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        const chainData = state.active[chainID] || {};
        chainData.status = "pending";
        chainData.errMsg = "";
        state.active[chainID] = chainData;
        state.loading = false;
      })
      .addCase(getProposals.fulfilled, (state, action) => {
        const chainID = action.payload?.chainID || "";
        if (chainID.length > 0) {
          let result = {
            status: "idle",
            errMsg: "",
            proposals: action.payload?.data?.proposals,
            pagination: action.payload?.pagination

          }
          state.active[chainID] = result;
          state.loading = false;
        }
      })
      .addCase(getProposals.rejected, (state, action) => {
        const chainID = action.payload?.chainID;
        const chainData = state.active[chainID] || {};
        chainData.status = "rejected";
        chainData.errMsg = action.error.message;
        state.active[chainID] = chainData;
      });

    // tally
    builder
      .addCase(getProposalTally.pending, () => { })
      .addCase(getProposalTally.fulfilled, (state, action) => {
        const chainID = action.payload.chainID;
        let result = {
          status: "idle",
          errMsg: "",
          proposalTally: state.tally[chainID]?.proposalTally || {}
        };

        result.proposalTally[action.payload?.data?.tally?.proposal_id] =
          action.payload?.data.tally;
        state.tally[chainID] = result;
      })
      .addCase(getProposalTally.rejected, () => {
      });

    // votes
    builder
      .addCase(getVotes.pending, () => {
      })
      .addCase(getVotes.fulfilled, (state, action) => {
        const chainID = action.payload.chainID;
        let result = {
          status: "idle",
          errMsg: "",
          proposals: []
        }

        result.proposals[action.payload?.data?.vote?.proposal_id] =
          action.payload.data;

        state.votes[chainID] = result
      })
      .addCase(getVotes.rejected, (state, action) => {
      });

    // tx-vote
    builder
      .addCase(txVote.pending, (state) => {
        state.tx.status = "pending";
      })
      .addCase(txVote.fulfilled, (state, _) => {
        state.tx.status = "idle";
      })
      .addCase(txVote.rejected, (state, _) => {
        state.tx.status = "rejected";
      });

    // proposal-info
    builder
      .addCase(getProposal.pending, (state) => {
        state.proposalInfo.status = "pending";
      })
      .addCase(getProposal.fulfilled, (state, action) => {
        state.proposalInfo.status = "idle";
        const chainID = action.meta.arg?.chainID || "";
        if (chainID.length > 0) {
          const old = state.active[chainID];
          if (old?.proposals?.length > 0) {
            old.proposals = [action.payload.proposal]
            state.active[chainID] = old;
          } else {
            state.active[chainID] = {
              status: "idle",
              errMsg: "",
              proposals: [action.payload?.proposal],
              pagination: {}
            }
          }
        }
      })
      .addCase(getProposal.rejected, (state, payload) => {
        state.proposalInfo.status = "rejected";
        state.proposalInfo.error =
          payload?.payload?.message || payload.error.message;
      });
  },
});

export const { resetTx, resetLoading } = proposalsSlice.actions;
export default proposalsSlice.reducer;
