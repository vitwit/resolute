import airdropService from './airdropService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fee, signAndBroadcastClaimMsg } from '../../txns/execute';
import { AirdropClaim } from '../../txns/passage';
import { setError, setTxHash } from '../common/commonSlice';

const initialState = {
    claimRecords: {},
    status: '',
    claimStatus: '',
    errMsg: '',
    params: {},
    tx: {
        status: 'idle'
    }
}

export const getClaimRecords = createAsyncThunk(
    'airdrop/claim-records',
    async (data) => {
        const response = await airdropService.claimRecords(data.baseURL, data.address);
        return response.data;
    }
);

export const getClaimParams = createAsyncThunk(
    'airdrop/claim-params',
    async (data) => {
        const response = await airdropService.params(data.baseURL);
        return response.data;
    }
);

export const txClaimAction = createAsyncThunk(
    'airdrop/claim-tx-1',
    async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
        try {
            const msg = AirdropClaim(data.address)
            const result = await signAndBroadcastClaimMsg(data.address, [msg], fee(data.denom, data.feeAmount, 200000),data.chainId, data.rpc, data.memo)
            if (result?.code === 0) {
                dispatch(setTxHash({
                    hash: result?.transactionHash
                }))
                return fulfillWithValue({ txHash: result?.transactionHash });
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
            return rejectWithValue(error.message)
        }
    }
)

export const airdropSlice = createSlice({
    name: 'airdrop',
    initialState,
    reducers: {
        resetState: (state) => {
            state.status = ''
            state.errMsg = ''
            state.claimRecords = {}
            state.params = {}
            state.claimStatus = ''
        },
        resetClaimRecords: (state) => {
            state.claimRecords = {}
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getClaimRecords.pending, (state) => {
                state.claimStatus = 'pending';
                state.errMsg = ''

            })
            .addCase(getClaimRecords.fulfilled, (state, action) => {
                state.claimStatus = 'idle';
                state.claimRecords = action.payload.claim_record
                state.errMsg = ''
            })
            .addCase(getClaimRecords.rejected, (state, action) => {
                state.claimStatus = 'rejected';
                state.claimRecords = {}
                state.errMsg = action.error.message
            })

            .addCase(getClaimParams.pending, (state) => {
                state.status = 'pending';
                state.errMsg = ''

            })
            .addCase(getClaimParams.fulfilled, (state, action) => {
                state.status = 'idle';
                state.params = action.payload.params
                state.errMsg = ''
            })
            .addCase(getClaimParams.rejected, (state, action) => {
                state.status = 'rejected';
                state.params = {}
                state.errMsg = action.error.message
            })

            .addCase(txClaimAction.pending, (state) => {
                state.tx.status = `pending`

            })
            .addCase(txClaimAction.fulfilled, (state, _) => {
                state.tx.status = `idle`
            })
            .addCase(txClaimAction.rejected, (state, _) => {
                state.tx.status = `rejected`
            })
    }

})


export const { resetState, resetClaimRecords } = airdropSlice.actions;
export default airdropSlice.reducer;
