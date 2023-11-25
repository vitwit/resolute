'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import govService from './govService';
import { cloneDeep } from 'lodash';
import { AxiosError } from 'axios';
import { ERR_UNKNOWN } from '@/utils/errors';
import { TxStatus } from '@/types/enums';
import {
  GovProposal,
  GetProposalTallyInputs,
  GetProposalsInDepositInputs,
  GetProposalsInVotingInputs,
  GetVotesInputs,
  ProposalTallyData,
  VotesData,
  GovPagination,
} from '@/types/gov';

interface Chain {
  active: {
    status: TxStatus;
    errMsg: string;
    proposals: GovProposal[];
    pagination?: GovPagination;
  };
  deposit: {
    status: TxStatus;
    errMsg: string;
    proposals: GovProposal[];
    pagination?: GovPagination;
  };
  votes: VotesData;
  tally: ProposalTallyData;
}

interface Chains {
  [key: string]: Chain;
}

interface GovState {
  chains: Chains;
  defaultState: Chain;
}

const EMPTY_PAGINATION = {
  next_key: '',
  total: '',
};

const initialState: GovState = {
  chains: {},
  defaultState: {
    active: {
      status: TxStatus.INIT,
      errMsg: '',
      proposals: [],
      pagination: {
        next_key: '',
        total: '',
      },
    },
    deposit: {
      status: TxStatus.INIT,
      errMsg: '',
      proposals: [],
      pagination: {
        next_key: '',
        total: '',
      },
    },
    votes: {
      status: TxStatus.INIT,
      errMsg: '',
      proposals: {},
    },
    tally: {
      status: TxStatus.INIT,
      errMsg: '',
      proposalTally: {},
    },
  },
};

export const getProposalsInDeposit = createAsyncThunk(
  'gov/deposit-proposals',
  async (data: GetProposalsInDepositInputs) => {
    const response = await govService.proposals(
      data.baseURL,
      data?.key,
      data?.limit,
      1
    );

    return {
      chainID: data.chainID,
      data: response.data,
    };
  }
);

export const getProposalsInVoting = createAsyncThunk(
  'gov/active-proposals',
  async (data: GetProposalsInVotingInputs, { rejectWithValue, dispatch }) => {
    try {
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
              proposalId: Number(proposals[i].proposal_id),
              chainID: data.chainID,
            })
          );

          dispatch(
            getVotes({
              baseURL: data.baseURL,
              proposalId: Number(proposals[i].proposal_id),
              voter: data.voter,
              chainID: data.chainID,
            })
          );
        }
      }

      return {
        chainID: data.chainID,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) return rejectWithValue(error.message);
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const getVotes = createAsyncThunk(
  'gov/voter-votes',
  async (data: GetVotesInputs) => {
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
      data: response.data,
    };
  }
);

export const getProposalTally = createAsyncThunk(
  'gov/proposal-tally',
  async (data: GetProposalTallyInputs) => {
    const response = await govService.tally(data.baseURL, data.proposalId);

    response.data.tally.proposal_id = data.proposalId;

    return {
      chainID: data.chainID,
      data: response.data,
    };
  }
);

export const govSlice = createSlice({
  name: 'gov',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // active proposals
    builder
      .addCase(getProposalsInVoting.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        const chainProposals = state.chains[chainID].active.proposals || {};
        const result = {
          status: TxStatus.PENDING,
          errMsg: '',
          proposals: chainProposals,
          pagination: EMPTY_PAGINATION,
        };
        state.chains[chainID].active = result;
      })
      .addCase(getProposalsInVoting.fulfilled, (state, action) => {
        const chainID = action.payload?.chainID || '';
        if (chainID.length) {
          const result = {
            status: TxStatus.IDLE,
            errMsg: '',
            proposals: action.payload?.data?.proposals,
            pagination: action.payload?.data?.pagination,
          };
          state.chains[chainID].active = result;
        }
      })
      .addCase(getProposalsInVoting.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        const chainProposals = state.chains[chainID].active.proposals || {};
        const result = {
          status: TxStatus.REJECTED,
          errMsg: action.error.message || '',
          proposals: chainProposals,
          pagination: EMPTY_PAGINATION,
        };
        state.chains[chainID].active = result;
      });

    //proposals in deposit period
    builder
      .addCase(getProposalsInDeposit.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        const chainProposals = state.chains[chainID].deposit.proposals || {};
        const result = {
          status: TxStatus.PENDING,
          errMsg: '',
          proposals: chainProposals,
          pagination: EMPTY_PAGINATION,
        };
        state.chains[chainID].deposit = result;
      })
      .addCase(getProposalsInDeposit.fulfilled, (state, action) => {
        const chainID = action.payload?.chainID || '';
        if (chainID.length) {
          const result = {
            status: TxStatus.IDLE,
            errMsg: '',
            proposals: action.payload?.data?.proposals,
            pagination: action.payload?.data?.pagination,
          };
          state.chains[chainID].deposit = result;
        }
      })
      .addCase(getProposalsInDeposit.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        const chainProposals = state.chains[chainID].deposit.proposals || {};
        const result = {
          status: TxStatus.REJECTED,
          errMsg: action.error.message || '',
          proposals: chainProposals,
          pagination: EMPTY_PAGINATION,
        };
        state.chains[chainID].deposit = result;
      });

    // votes
    builder
      .addCase(getVotes.pending, () => {})
      .addCase(getVotes.fulfilled, (state, action) => {
        const chainID = action.payload.chainID;
        const result: VotesData = {
          status: TxStatus.IDLE,
          errMsg: '',
          proposals: state.chains[chainID].votes?.proposals || {},
        };

        result.proposals[action.payload?.data?.vote?.proposal_id] =
          action.payload.data;

        state.chains[chainID].votes = result;
      })
      .addCase(getVotes.rejected, () => {});

    // tally
    builder
      .addCase(getProposalTally.pending, () => {})
      .addCase(getProposalTally.fulfilled, (state, action) => {
        const chainID = action.payload.chainID;
        const result = {
          status: TxStatus.IDLE,
          errMsg: '',
          proposalTally: state.chains[chainID].tally?.proposalTally || {},
        };

        result.proposalTally[action.payload?.data?.tally?.proposal_id] =
          action.payload?.data.tally;
        state.chains[chainID].tally = result;
      })
      .addCase(getProposalTally.rejected, () => {});
  },
});

export const {} = govSlice.actions;
export default govSlice.reducer;
