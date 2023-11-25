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
  DepositParams,
  GetDepositParamsInputs,
  GetProposalInputs,
} from '@/types/gov';
import { PROPOSAL_STATUS_VOTING_PERIOD } from '@/utils/constants';

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
  depositParams: {
    status: TxStatus;
    errMsg: string;
    params: DepositParams;
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
  proposalInfo: {
    status: TxStatus;
    errMsg: string;
  };
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
    depositParams: {
      status: TxStatus.INIT,
      errMsg: '',
      params: {
        min_deposit: [
          {
            denom: '',
            amount: '',
          },
        ],
        max_deposit_period: '',
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
  proposalInfo: {
    status: TxStatus.INIT,
    errMsg: '',
  },
};

export const getProposal = createAsyncThunk(
  'gov/proposal-info',
  async (data: GetProposalInputs, { rejectWithValue }) => {
    try {
      const response = await govService.proposal(data.baseURL, data.proposalId);
      return {
        chainID: data.chainID,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const getProposalsInDeposit = createAsyncThunk(
  'gov/deposit-proposals',
  async (data: GetProposalsInDepositInputs, { rejectWithValue, dispatch }) => {
    try {
      const response = await govService.proposals(
        data.baseURL,
        data?.key,
        data?.limit,
        1
      );

      if (response?.data?.proposals?.length && data?.chainID?.length) {
        dispatch(
          getDepositParams({
            baseURL: data.baseURL,
            chainID: data.chainID,
          })
        );
      }

      return {
        chainID: data.chainID,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const getDepositParams = createAsyncThunk(
  'gov/deposit-params',
  async (data: GetDepositParamsInputs, { rejectWithValue }) => {
    try {
      const response = await govService.depositParams(data.baseURL);

      return {
        chainID: data.chainID,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
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

      if (response?.data?.proposals?.length) {
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
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const getVotes = createAsyncThunk(
  'gov/voter-votes',
  async (data: GetVotesInputs, { rejectWithValue }) => {
    try {
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
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
  }
);

export const getProposalTally = createAsyncThunk(
  'gov/proposal-tally',
  async (data: GetProposalTallyInputs, { rejectWithValue }) => {
    try {
      const response = await govService.tally(data.baseURL, data.proposalId);

      response.data.tally.proposal_id = data.proposalId;

      return {
        chainID: data.chainID,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof AxiosError)
        return rejectWithValue({ message: error.message });
      return rejectWithValue({ message: ERR_UNKNOWN });
    }
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
        const payload = action.payload as { message: string };
        const chainProposals = state.chains[chainID].active.proposals || {};
        const result = {
          status: TxStatus.REJECTED,
          errMsg: payload.message || '',
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
        const payload = action.payload as { message: string };
        const chainProposals = state.chains[chainID].deposit.proposals || {};
        const result = {
          status: TxStatus.REJECTED,
          errMsg: payload.message || '',
          proposals: chainProposals,
          pagination: EMPTY_PAGINATION,
        };
        state.chains[chainID].deposit = result;
      });

    // votes
    builder
      .addCase(getVotes.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].votes.status = TxStatus.PENDING;
      })
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
      .addCase(getVotes.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        const payload = action.payload as { message: string };
        state.chains[chainID].votes.status = TxStatus.REJECTED;
        state.chains[chainID].votes.errMsg = payload.message || '';
      });

    // tally
    builder
      .addCase(getProposalTally.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tally.status = TxStatus.PENDING;
      })
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
      .addCase(getProposalTally.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        const payload = action.payload as { message: string };
        state.chains[chainID].tally.status = TxStatus.REJECTED;
        state.chains[chainID].tally.errMsg = payload.message || '';
      });

    //deposit params
    builder
      .addCase(getDepositParams.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].depositParams.status = TxStatus.PENDING;
      })
      .addCase(getDepositParams.fulfilled, (state, action) => {
        const chainID = action.payload?.chainID || '';
        if (chainID.length) {
          const result = {
            status: TxStatus.IDLE,
            errMsg: '',
            params: action.payload?.data?.deposit_params,
          };
          state.chains[chainID].depositParams = result;
        }
      })
      .addCase(getDepositParams.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        const payload = action.payload as { message: string };
        state.chains[chainID].depositParams.status = TxStatus.REJECTED;
        state.chains[chainID].depositParams.errMsg = payload.message || '';
      });

    // get one proposal
    builder
      .addCase(getProposal.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        if (!state.chains[chainID])
          state.chains[chainID] = cloneDeep(initialState.defaultState);
        state.proposalInfo.status = TxStatus.PENDING;
      })
      .addCase(getProposal.fulfilled, (state, action) => {
        const chainID = action.meta.arg?.chainID || '';
        if (
          action.payload.data?.proposal.status === PROPOSAL_STATUS_VOTING_PERIOD
        ) {
          const currentProposalsState = state.chains[chainID].active.proposals;
          if (!currentProposalsState.length) {
            const result = {
              status: TxStatus.IDLE,
              errMsg: '',
              proposals: [action.payload.data.proposal],
            };
            state.chains[chainID].active = result;
          }
        } else {
          const currentProposalsState = state.chains[chainID].deposit.proposals;
          if (!currentProposalsState.length) {
            const result = {
              status: TxStatus.IDLE,
              errMsg: '',
              proposals: [action.payload.data.proposal],
            };
            state.chains[chainID].deposit = result;
          }
        }
        state.proposalInfo.status = TxStatus.IDLE;
        state.proposalInfo.errMsg = '';
      })
      .addCase(getProposal.rejected, (state, action) => {
        state.proposalInfo.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.proposalInfo.errMsg = payload.message || '';
      });
  },
});

export const {} = govSlice.actions;
export default govSlice.reducer;
