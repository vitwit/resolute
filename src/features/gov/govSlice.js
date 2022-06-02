import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fee, signAndBroadcastAmino } from '../../txns/execute';
import { GovVoteMsg } from '../../txns/proto';
import { setError, setTxHash } from '../common/commonSlice';
import govService from './govService';

const initialState = {
  active: {
    proposals: [],
    status: 'idle',
    errMsg: '',
  },
  tally: {
    status: 'idle',
    errMsg: '',
    proposalTally: {},
  },
  votes: {
    status: 'idle',
    errMsg: '',
    proposals: {},
  },
  tx: {
    status: ''
  }
};

export const getProposals = createAsyncThunk(
  'gov/active-proposals',
  async (data, {dispatch}) => {
    const response = await govService.proposals(data.baseURL, data.key, data.limit, 2);
    if (response?.data?.proposals?.length > 0) {
      const proposals = response?.data?.proposals
      for(let i = 0;i < proposals.length;i++) {
        dispatch(getProposalTally({
          baseURL: data.baseURL,
          proposalId: proposals[i].proposal_id
        }))

        dispatch(getVotes({
          baseURL: data.baseURL,
          proposalId: proposals[i].proposal_id,
          voter: data.voter
        }))
      }
    }
    return response.data;
  }
);

export const getProposalTally = createAsyncThunk(
  'gov/proposal-tally',
  async (data) => {
    const response = await govService.tally(data.baseURL, data.proposalId);
    response.data.tally.proposal_id = data.proposalId
    return response.data;
  }
);

export const getVotes = createAsyncThunk(
  'gov/voter-votes',
  async (data) => {
    const response = await govService.votes(data.baseURL,data.proposalId, data.voter, data.key, data.limit);
    response.data.vote.proposal_id = data.proposalId
    return response.data;
  }
);

export const txVote = createAsyncThunk(
  'gov/tx-vote',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = GovVoteMsg(data.proposalId, data.voter, data.option)
      const result = await signAndBroadcastAmino([msg], fee(data.denom, data.feeAmount),data.chainId, data.rpc)
      if (result?.code === 0) {
        dispatch(setTxHash({
          hash: result?.transactionHash
        }))
        return fulfillWithValue({txHash: result?.transactionHash});
        } else {
          dispatch(setError({
            type: 'error',
            message: result?.rawLog
          }))
          return rejectWithValue(result?.rawLog);
        }
    } catch (error) {
      dispatch(setError({
        type: 'error',
        message: error.message
      }))
      return rejectWithValue(error)
    }
  }
);


export const proposalsSlice = createSlice({
  name: 'gov',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProposals.pending, (state) => {
        state.active.status = 'pending';
        state.active.errMsg = ''
      })
      .addCase(getProposals.fulfilled, (state, action) => {
        state.active.status = 'idle';
        state.active.proposals = action.payload?.proposals
        state.active.pagination = action.payload?.pagination
        state.active.errMsg = ''
      })
      .addCase(getProposals.rejected, (state, action) => {
        state.active.status = 'rejected';
        state.active.errMsg = action.error.message
      })

      // tally
      builder
      .addCase(getProposalTally.pending, (state) => {
        state.tally.status = 'pending';
        state.tally.errMsg = ''
      })
      .addCase(getProposalTally.fulfilled, (state, action) => {
        state.tally.status = 'idle';
        state.tally.proposalTally[action.payload?.tally?.proposal_id] = action.payload?.tally
        state.tally.errMsg = ''
      })
      .addCase(getProposalTally.rejected, (state, action) => {
        state.tally.status = 'rejected';
        state.tally.errMsg = action.error.message
      })

      // votes
      builder
      .addCase(getVotes.pending, (state) => {
        state.votes.status = 'pending';
        state.votes.errMsg = ''
      })
      .addCase(getVotes.fulfilled, (state, action) => {
        state.votes.status = 'idle';
        state.votes.proposals[action.payload?.vote?.proposal_id] = action.payload?.vote
        state.votes.errMsg = ''
      })
      .addCase(getVotes.rejected, (state, action) => {
        state.votes.status = 'rejected';
        state.votes.errMsg = action.error.message
      })

      // tx-vote
      builder
      .addCase(txVote.pending, (state) => {
        state.tx.status = 'pending';

      })
      .addCase(txVote.fulfilled, (state, _) => {
        state.tx.status = 'idle';
      })
      .addCase(txVote.rejected, (state, _) => {
        state.tx.status = 'rejected';
      })

  },
});

export default proposalsSlice.reducer;
