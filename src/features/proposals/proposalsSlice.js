import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchProposals, fetchProposalTally } from './proposalsAPI';

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
};

export const getProposals = createAsyncThunk(
  'gov/active-proposals',
  async (data) => {
    const response = await fetchProposals(data.baseURL, data.key, data.limit, 2);
    return response.data;
  }
);

export const getProposalTally = createAsyncThunk(
  'gov/proposal-tally',
  async (data) => {
    const response = await fetchProposalTally(data.baseURL, data.proposalId);
    response.data.tally.proposal_id = data.proposalId
    return response.data;
  }
);


export const proposalsSlice = createSlice({
  name: 'gov',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProposals.pending, (state) => {
        state.active.status = 'loading';
        state.active.errMsg = ''
      })
      .addCase(getProposals.fulfilled, (state, action) => {
        state.active.status = 'idle';
        state.active.proposals = action.payload?.proposals // TODO: handle paginated
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
        state.tally.status = 'loading';
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

  },
});

export const { proposals } = proposalsSlice.actions;

export default proposalsSlice.reducer;
