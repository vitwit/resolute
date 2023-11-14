import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GovVoteMsg } from 'staking/gov';
import { signAndBroadcast } from 'staking/utils/signing';
import govService from './govService';
import { GovDepositMsg } from 'staking/gov/deposit';
import { create } from 'domain';
import { TxStatus } from 'staking/types/store';

interface Proposal {
  
}

interface Tally {
  // Define your tally data structure here
}

interface Vote {
  // Define your vote data structure here
}

interface LoadingState {
  loading: number;
}

interface ProposalState {
  proposals: Record<string, Proposal[]>;
  status: string;
  errMsg: string;
}

interface DepositState {
  proposals: Record<string, Proposal[]>;
  status: string;
  errMsg: string;
}

interface DepositParams {
  // Define your deposit parameters here
}

interface TxState {
  status: string;
}

interface ProposalInfo {
  status: string;
  error: string;
  proposalInfo: Proposal;
}

interface GovState {
  loading: number;
  active: Record<string, ProposalState>;
  deposit: Record<string, DepositState>;
  depositParams: DepositParams;
  tally: Tally;
  votes: Record<string, Vote>;
  tx: TxState;
  proposalInfo: ProposalInfo;
}

const initialState: GovState = {
  loading: 0,
  active: {},
  deposit: {},
  depositParams: {},
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
    status: '',
  },
  proposalInfo: {
    status: 'idle',
    error: '',
    proposalInfo: {},
  },
};


export const getProposal = createAsyncThunk(
  'gov/proposal-info',
  async(
    data: ,
    {rejectWithValue}
  ) => {
    try {
      const response = await govService.proposal(
        data.baseURL,
        data.proposalId
      )
      return response.data;
    }
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
)

export const getProposalsInDeposit = createAsyncThunk(
  'gov/deposit-proposals',
  async (data: {
    baseURL: string;
    key: string;
    limit: number;
    chainID: string;
    status: number;
  }) => {
    const response = await govService.proposals(
      data.baseURL,
      data.key,
      data.limit,
      data.status
    );
    return {
      chainID: data.chainID,
      data: response.data,
    };
  }
);


export const getProposalsInVoting = createAsyncThunk(
  'gov/active-proposals',
  async(data: {
    baseURL: string;
    key: string;
    limit: string;
    status: number;
  }) => {
    const response = await govService.proposals(
      data.baseURL,
      data.key,
      data.limit,
      data.status
    );
    if (response?.data?.proposals?.length>0) {
      const proposals = response?.data?.proposals;
      for (let i=0; i<proposals.length; i++) {
        return getProposalTally({
         baseURL: data.baseURL,
         proposalId: proposals[i].proposal_id,
         chainID: data.chainID
        });
        return getVotes ({
           data.baseURL,
          proposalId: proposals[i].proposal_id,
          data.voter,
         data.chainID
        });
      }
      return {
        chainID: data.chainID,
        data: response.data,
        }
      }
    }
  
)


export const getProposalTally = createAsyncThunk(
  'gov/proposal-tally',
  async (data: {
    baseURL: string;
    proposalId: number;
    chainID: string;
  }) => {
    const response = await govService.tally (
      data.baseURL,
      data.proposalId,
    );
    return {
      chainID: data.chainID,
      data: response.data,
    }
  }
)

export const getVotes = createAsyncThunk(
  'gov/voter-votes',
  async (data: {
    baseURL: string;
    proposalId: number;
    voter: string;
    key: string;
    limit: number;
    chainID : string;
  }) => {
    const response = await govService.votes (
      data.baseURL,
      data.proposalId,
      data.voter,
      data.key,
      data.limit
    )
    return {
      chainID: data.chainID,
      data: response.data,
    }
  }
)

//Done
export const getDepositParams = createAsyncThunk (
  'gov/deposit-params',
  async (
    data:,
    {rejectWithValue}
  ) => {
    try {
      const response = await govService.depositParams (
        data.baseURL,
        data.chainID
      );
      return {
        chainID: data.chainID,
        data: response.data,
      };
    }catch (error) {
      return rejectWithValue(error);
    }
  }
)

//Done
export const txVote = createAsyncThunk(
  'gov/tx-vote',
  async (
    data: ,
    {rejectWithValue, fulfillWithValue}
  ) => {
    try {
      const msg = GovVoteMsg(
        data.proposalId,
        data.voter,
        data.option
      )
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        data.msg,
        860000,
        data?.justification || "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        return fulfillWithValue({txHash: result?.transactionHash });
      }else {
        return rejectWithValue(result?.rawLog);
      }}
      catch (error: any) {
        return rejectWithValue(error.message);
    }
  }
);


export const txDeposit = createAsyncThunk (
  'gov/tx-deposit',
  async(
    data: ,
    {rejectWithValue, fulfillWithValue}
  ) => {
    try {
      const msg = GovDepositMsg(
        data.proposalId,
        data.depositer,
        data.amount,
        data.denom
      );
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        860000,
        data?.justification || "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        return fulfillWithValue({txHash: result?.transactionHash})
    }else {
      return rejectWithValue(result?.rawLog);
    }}
    catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
)

export const proposalsSlice = createSlice({
  name: 'gov',
  initialState,
  reducers: {
    resetLoading: (state: GovState ,action) => {
      const { chainsCount } = action.payload;
      state.loading += chainsCount;
    },
    resetTx: (state) => {
      state.tx = {
        status: TxStatus.INIT};
      },
    },
  
  extraReducers: (builder) => {
    builder
      .addCase(getProposalsInVoting.pending, (state: GovState, action) => {
        const chainID = action.meta.arg.chainID;
        state.active[chainID].status= TxStatus.PENDING;
        state.loading++;
      })
      .addCase(getProposalsInVoting.fulfilled, (state, action) => {
        const chainID = action.payload?.chainID;
        if (chainID.length > 0) {
        const result = {
          proposals: action.payload?.data?.proposals,
          pagination: action.payload?.pagination,
          status: TxStatus.IDLE,
          errMsg: '',
        }
        }
        state.active[chainID] = result;
        state.loading--;
        
      })
      .addCase(getProposalsInVoting.rejected, (state: GovState, action) => {
        const chainID = action.meta.arg.chainID;
        state.active[chainID].status= TxStatus.REJECTED;
        state.loading--;
      });

    builder
      .addCase(getProposalsInDeposit.pending, (state: GovState, action) => {
        const chainID = action.meta.arg.chainID;
        const chainData = state.deposit[chainID] || {};
        state.deposit[chainID].status = TxStatus.PENDING;
        state.loading++;
      })
      .addCase(getProposalsInDeposit.fulfilled, (state, action) => {
        const chainID = action.payload.chainID;
        const result = {
          proposals: action.payload.data?.proposals,
          pagination: action.payload?.pagination,
          status: TxStatus.IDLE,
          errMsg: '',
        }
        state.deposit[chainID] = result;
        
        state.loading--;
      })
      .addCase(getProposalsInDeposit.rejected, (state:GovState, action) => {
        const chainID = action.meta.arg.chainID;
        state.deposit[chainID].status = TxStatus.REJECTED
        state.loading--;
      });

       // tally
    builder
    .addCase(getProposalTally.pending, (state) => {
      state.tx.status = TxStatus.PENDING;
    })
    .addCase(getProposalTally.fulfilled,(state: GovState, action ) => {
      const chainID = action.payload.chainID;
     const result = {
      status: TxStatus.IDLE,
      errMsg: '',
      proposalTally: state.tally[chainID]?.proposalTally || {},
     };

    })
    .addCase(getProposalTally.fulfilled, (state, action) => {
      const chainID = action.payload.chainID;
      let result = {
        status: "idle",
        errMsg: "",
        proposalTally: state.tally[chainID]?.proposalTally || {},
      };
      result.proposalTally[action.payload?.data?.tally?.proposal_id] =
        action.payload?.data.tally;
      state.tally[chainID] = result;
    })
    .addCase(getProposalTally.rejected, (state) => {
      state.tx.status = TxStatus.REJECTED;
    });

    //votes
    builder
    .addCase(getVotes.pending, (state) => {
      state.tx.status = TxStatus.PENDING;
    })
    .addCase(getVotes.fulfilled, (state: GovState, action) => {
      const chainID = action.payload.chainID;
      const result = {
        status: "idle",
        errMsg: "",
        proposals: [],
      };

      result.proposals[action.payload?.data?.vote?.proposal_id] =
        action.payload.data;

      state.votes[chainID] = result;
    })
    .addCase(getVotes.rejected, (state: GovState, action) => {
      state.tx.status = TxStatus.REJECTED;
    });


    // tx-vote
    builder
      .addCase(txVote.pending, (state) => {
        state.tx.status = TxStatus.PENDING;
      })
      .addCase(txVote.fulfilled, (state) => {
        state.tx.status = TxStatus.IDLE;
      })
      .addCase(txVote.rejected, (state) => {
        state.tx.status = TxStatus.REJECTED;
      });

       // tx-deposit
    builder
    .addCase(txDeposit.pending, (state) => {
      state.tx.status = TxStatus.PENDING;
    })
    .addCase(txDeposit.fulfilled, (state) => {
      state.tx.status = TxStatus.IDLE;
    })
    .addCase(txDeposit.rejected, (state) => {
      state.tx.status = TxStatus.REJECTED;
    });
     // proposal-info
     builder
     .addCase(getProposal.pending, (state) => {
       state.proposalInfo.status = TxStatus.PENDING;
     })
     .addCase(getProposal.fulfilled, (state, action) => {
       state.proposalInfo.status = TxStatus.IDLE;
       const chainID = action.meta.arg?.chainID || "";
       if (chainID.length > 0) {
         const old = state.active[chainID];
         if (old?.proposals?.length > 0) {
           old.proposals = [action.payload.proposal];
           state.active[chainID] = old;
         } else {
           state.active[chainID] = {
             status: "idle",
             errMsg: "",
             proposals: [action.payload?.proposal],
             pagination: {},
           };
         }
       }
     })
     .addCase(getProposal.rejected, (state:GovState ,payload) => {
       state.proposalInfo.status = TxStatus.REJECTED;
       state.proposalInfo.error =
         payload?.payload?.message || payload.error.message;
     });


     builder
     .addCase(getDepositParams.pending, (state) => {
      state.tx.status = TxStatus.PENDING;
     })
     .addCase(getDepositParams.fulfilled, (state, action) => {
       state.depositParams.status = TxStatus.IDLE;
       const chainID = action.payload?.chainID || "";
       if (chainID.length > 0) {
         state.depositParams[chainID] = {
           status: "idle",
           errMsg: "",
           depositParams: action.payload?.data?.deposit_params,
         };
       }
     })
     .addCase(getDepositParams.rejected, (state) => {
      state.tx.status = TxStatus.REJECTED;
     });
 },
});

    
 

export const { resetTx, resetLoading } = proposalsSlice.actions;
export default proposalsSlice.reducer;
