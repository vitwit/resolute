import airdropService from './airdropService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    claimRecords: {},
    status: '',
    errMsg: '',
}

export const getClaimRecords = createAsyncThunk(
    'airdrop/claim-records',
    async (data) => {
        const response = await airdropService.claimRecords(data.baseURL, data.address);
        return response.data;
    }
);

export const airdropSlice = createSlice({
    name: 'airdrop',
    initialState,
    reducers: {
        resetState: (state) => {
            state.status = ''
            state.errMsg = ''
            state.claimRecords = {}
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getClaimRecords.pending, (state) => {
                state.status = 'pending';
                state.errMsg = ''

            })
            .addCase(getClaimRecords.fulfilled, (state, action) => {
                state.status = 'idle';
                state.claimRecords = action.payload.claim_record
                state.errMsg = ''
            })
            .addCase(getClaimRecords.rejected, (state, action) => {
                state.status = 'rejected';
                state.claimRecords = {}
                console.log(action)
                state.errMsg = action.error.message
            })
    }

})


export const {resetState} = airdropSlice.actions;
export default airdropSlice.reducer;
