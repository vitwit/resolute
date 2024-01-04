'use client';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
  DepositParams,
  GetDepositParamsInputs,
  GetProposalInputs,
  TxVoteInputs,
  TxDepositInputs,
  GovParamsResponse,
} from '@/types/gov';
import { GAS_FEE, PROPOSAL_STATUS_VOTING_PERIOD } from '@/utils/constants';
import { signAndBroadcast } from '@/utils/signing';
import { setError, setTxAndHash } from '../common/commonSlice';
import { GovDepositMsg, GovVoteMsg } from '@/txns/gov';
import { NewTransaction } from '@/utils/transaction';

const PROPSAL_STATUS_DEPOSIT = 1;
const PROPOSAL_STATUS_ACTIVE = 2;

interface Chain {
  active: {
    status: TxStatus;
    errMsg: string;
    proposals: GovProposal[];
    pagination?: Pagination;
  };
  deposit: {
    status: TxStatus;
    errMsg: string;
    proposals: GovProposal[];
    pagination?: Pagination;
  };
  depositParams: {
    status: TxStatus;
    errMsg: string;
    params: DepositParams;
  };
  tallyParams: {
    status: TxStatus;
    errMsg: string;
    params: GovParamsResponse;
  };
  votes: VotesData;
  tally: ProposalTallyData;
  tx: {
    status: TxStatus;
    txHash: string;
  };
}

export interface Chains {
  [key: string]: Chain;
}

interface GovState {
  chains: Chains;
  defaultState: Chain;
  proposalInfo: {
    status: TxStatus;
    errMsg: string;
  };
  activeProposalsLoading: number;
  depositProposalsLoading: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proposalDetails: any; // eslint-disable-next-line @typescript-eslint/no-explicit-any
}

const EMPTY_PAGINATION = {
  next_key: '',
  total: '',
};

const initialState: GovState = {
  chains: {},
  activeProposalsLoading: 0,
  depositProposalsLoading: 0,
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
    tx: {
      status: TxStatus.INIT,
      txHash: '',
    },
    tallyParams: {
      errMsg: '',
      status: TxStatus.INIT,
      params: {
        voting_params: {
          voting_period: '',
        },
        deposit_params: {
          min_deposit: [
            {
              denom: '',
              amount: '',
            },
          ],
          max_deposit_period: '',
        },
        tally_params: {
          quorum: '',
          threshold: '',
          vote_threshold: '',
        },
      },
    },
  },
  proposalInfo: {
    status: TxStatus.INIT,
    errMsg: '',
  },
  proposalDetails: {},
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

export const getGovTallyParams = createAsyncThunk(
  'gov/tally-params',
  async (data: GetDepositParamsInputs, { rejectWithValue }) => {
    try {
      const response = await govService.govTallyParams(data.baseURL);
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
        PROPSAL_STATUS_DEPOSIT
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
        PROPOSAL_STATUS_ACTIVE
      );

      const { data: responseData } = response || {};
      const proposals = responseData?.proposals || [];
      proposals.forEach((proposal) => {
        const proposalId = Number(proposal.proposal_id);
        dispatch(
          getProposalTally({
            baseURL: data?.baseURL,
            proposalId,
            chainID: data?.chainID,
          })
        );
        dispatch(
          getVotes({
            baseURL: data?.baseURL,
            proposalId,
            voter: data?.voter,
            chainID: data?.chainID,
          })
        );
      });

      return {
        chainID: data.chainID,
        data: responseData,
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

export const txVote = createAsyncThunk(
  'gov/tx-vote',
  async (
    data: TxVoteInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const msg = GovVoteMsg(data.proposalId, data.voter, data.option);
      const result = await signAndBroadcast(
        data.chainID,
        data.aminoConfig,
        data.prefix,
        [msg],
        GAS_FEE,
        data?.justification || '',
        `${data.feeAmount}${data.denom}`,
        data.rest
        // data.feegranter?.length > 0 ? data.feegranter : undefined
      );

      const tx = NewTransaction(result, [msg], data.chainID, data.voter);

      if (result?.code === 0) {
        dispatch(
          setTxAndHash({
            tx: tx,
            hash: result?.transactionHash,
          })
        );

        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: 'error',
            message: result?.rawLog || '',
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(
          setError({
            type: 'error',
            message: error.message,
          })
        );
        return rejectWithValue(error.response);
      }
      dispatch(
        setError({
          type: 'error',
          message: ERR_UNKNOWN,
        })
      );
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const txDeposit = createAsyncThunk(
  'gov/tx-deposit',
  async (
    data: TxDepositInputs,
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      const msg = GovDepositMsg(
        data.proposalId,
        data.depositer,
        data.amount,
        data.denom
      );
      const result = await signAndBroadcast(
        data.chainID,
        data.aminoConfig,
        data.prefix,
        [msg],
        860000,
        data?.justification || '',
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      const { code, transactionHash, rawLog } = result || {};

      const tx = NewTransaction(result, [msg], data.chainID, data.depositer);

      if (code === 0) {
        dispatch(setTxAndHash({ tx: tx, hash: transactionHash }));
        return fulfillWithValue({ txHash: transactionHash });
      } else {
        dispatch(setError({ type: 'error', message: rawLog || '' }));
        return rejectWithValue(rawLog);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(
          setError({
            type: 'error',
            message: error.message,
          })
        );
        return rejectWithValue(error.response);
      }
      dispatch(
        setError({
          type: 'error',
          message: ERR_UNKNOWN,
        })
      );
      return rejectWithValue(ERR_UNKNOWN);
    }
  }
);

export const govSlice = createSlice({
  name: 'gov',
  initialState,
  reducers: {
    resetTx: (state, action: PayloadAction<{ chainID: string }>) => {
      const chainID = action.payload.chainID;
      state.chains[chainID].tx = {
        status: TxStatus.INIT,
        txHash: '',
      };
    },
    resetState: (state, action: PayloadAction<{ chainID: string }>) => {
      const { chainID } = action.payload;
      state.chains[chainID] = cloneDeep(initialState.defaultState);
    },
    resetDefaultState: (state, action: PayloadAction<string[]>) => {
      const chainsMap: Chains = {};
      const chains = action.payload;
      chains.map((chainID) => {
        chainsMap[chainID] = cloneDeep(initialState.defaultState);
      });
      state.chains = chainsMap;
    },
  },
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
        state.activeProposalsLoading++;
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
          state.activeProposalsLoading--;
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
        state.activeProposalsLoading--;
      });

    //proposals in tally params
    builder
      .addCase(getGovTallyParams.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tallyParams = {
          status: TxStatus.PENDING,
          errMsg: '',
          params: state.chains[chainID].tallyParams.params,
        };
      })
      .addCase(getGovTallyParams.fulfilled, (state, action) => {
        const chainID = action.payload?.chainID || '';
        if (chainID.length) {
          const result = {
            status: TxStatus.IDLE,
            errMsg: '',
            params: action.payload?.data,
          };
          state.chains[chainID].tallyParams = result;
        }
      })
      .addCase(getGovTallyParams.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        const payload = action.payload as { message: string };
        state.chains[chainID].tallyParams = {
          status: TxStatus.REJECTED,
          errMsg: payload?.message,
          params: state.chains[chainID]?.tallyParams?.params,
        };
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
        state.depositProposalsLoading++;
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
          state.depositProposalsLoading--;
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
        state.depositProposalsLoading--;
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

          // const result = {
          //   status: TxStatus.IDLE,
          //   proposal: action.payload.data.proposal
          // };
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
        state.proposalDetails = action.payload.data.proposal;
        state.proposalInfo.status = TxStatus.IDLE;
        state.proposalInfo.errMsg = '';
      })
      .addCase(getProposal.rejected, (state, action) => {
        state.proposalInfo.status = TxStatus.REJECTED;
        const payload = action.payload as { message: string };
        state.proposalInfo.errMsg = payload.message || '';
      });

    // tx-vote
    builder
      .addCase(txVote.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.txHash = '';
      })
      .addCase(txVote.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = TxStatus.IDLE;
        state.chains[chainID].tx.txHash = action.payload.txHash;
      })
      .addCase(txVote.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = TxStatus.REJECTED;
        state.chains[chainID].tx.txHash = '';
      });

    builder
      .addCase(txDeposit.pending, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = TxStatus.PENDING;
        state.chains[chainID].tx.txHash = '';
      })
      .addCase(txDeposit.fulfilled, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = TxStatus.IDLE;
        state.chains[chainID].tx.txHash = action.payload.txHash;
      })
      .addCase(txDeposit.rejected, (state, action) => {
        const chainID = action.meta?.arg?.chainID;
        state.chains[chainID].tx.status = TxStatus.REJECTED;
        state.chains[chainID].tx.txHash = '';
      });
  },
});

export const { resetTx, resetState, resetDefaultState } = govSlice.actions;
export default govSlice.reducer;
