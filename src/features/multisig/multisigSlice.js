import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createMultisigAccount, createSignature, createTransaction, deleteTx, fetchDelegatorValidators, fetchMultisigAccount, fetchMultisigAccountByAddress, fetchMultisigAccounts, fetchSignatures, fetchTransactins, fetchTransaction, updateTransaction } from './multisigService';

const initialState = {
    createMultisigAccountRes: {},
    multisigAccounts: {},
    createTxnRes: {},
    txns: {},
    txn: {},
    createSignRes: {},
    signatures: {},
    multisigAccount: {},
    delegatorVals: {},
    updateTxn: {},
    deleteTxnRes: {}
};

export const createAccount = createAsyncThunk(
    'multisig/createAccount',
    async (data) => {
        const response = await createMultisigAccount(data);
        return response.data;
    }
);

export const getMultisigAccounts = createAsyncThunk(
    'multisig/getMultisigAccounts',
    async (data) => {
        const response = await fetchMultisigAccounts(data);
        return response.data;
    }
);

export const deleteTxn = createAsyncThunk(
    'multisig/deleteTxn',
    async (data) => {
        const response = await deleteTx(data);
        return response.data;
    }
);

export const getDelegatorValidators = createAsyncThunk(
    'multisig/getDelegatorValidators',
    async ({ lcdUrl, delegatorAddress }) => {
        console.log('delegator addresssss------- ', lcdUrl, delegatorAddress)
        const response = await fetchDelegatorValidators(lcdUrl, delegatorAddress);
        return response.data;
    }
);

export const getMultisigAccount = createAsyncThunk(
    'multisig/getMultisigAccount',
    async (data) => {
        const response = await fetchMultisigAccount(data);
        return response.data;
    }
);

export const fetchSingleMultiAccount = createAsyncThunk(
    'multisig/fetchSingleMultiAccount',
    async (data) => {
        const response = await fetchMultisigAccountByAddress(data);
        return response.data;
    }
);



export const createTxn = createAsyncThunk(
    'multisig/createTxn',
    async (data) => {
        const response = await createTransaction(data);
        return response.data;
    }
);

export const updateTxn = createAsyncThunk(
    'multisig/updateTxn',
    async ({txId, body}) => {
        const response = await updateTransaction({txId, body});
        return response.data;
    }
);

export const getTxns = createAsyncThunk(
    'multisig/getTxns',
    async ({address, status}) => {
        const response = await fetchTransactins(address, status);
        return response.data;
    }
);

export const createSign = createAsyncThunk(
    'multisig/createSign',
    async (data) => {
        const response = await createSignature(data);
        return response.data;
    }
);

export const getSigns = createAsyncThunk(
    'multisig/getSigns',
    async ({ address, txId }) => {
        const response = await fetchSignatures(address, txId);
        return response.data;
    }
);

export const getSingleTxn = createAsyncThunk(
    'multisig/getSingleTxn',
    async (txId) => {
        const response = await fetchTransaction(txId);
        return response.data;
    }
);

export const multiSlice = createSlice({
    name: 'multisig',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createAccount.pending, (state) => {
                state.createMultisigAccountRes.status = 'pending'
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.createMultisigAccountRes.status = 'done'
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.createMultisigAccountRes.status = 'rejected'
            })

        builder
            .addCase(getMultisigAccounts.pending, (state) => {
                state.multisigAccounts.status = 'pending'
            })
            .addCase(getMultisigAccounts.fulfilled, (state, action) => {
                state.multisigAccounts = action.payload
            })
            .addCase(getMultisigAccounts.rejected, (state, action) => {
                state.multisigAccounts.status = 'rejected'
            })

        builder
            .addCase(getMultisigAccount.pending, (state) => {
                state.multisigAccount.status = 'pending'
            })
            .addCase(getMultisigAccount.fulfilled, (state, action) => {
                state.multisigAccount = action.payload
            })
            .addCase(getMultisigAccount.rejected, (state, action) => {
                state.multisigAccount.status = 'rejected'
            })

        builder
            .addCase(fetchSingleMultiAccount.pending, (state) => {
                state.multisigAccount.status = 'pending'
            })
            .addCase(fetchSingleMultiAccount.fulfilled, (state, action) => {
                state.multisigAccount = action.payload
            })
            .addCase(fetchSingleMultiAccount.rejected, (state, action) => {
                state.multisigAccount.status = 'rejected'
            })

        builder
            .addCase(createTxn.pending, (state) => {
                state.createTxnRes.status = 'pending'
            })
            .addCase(createTxn.fulfilled, (state, action) => {
                state.createTxnRes.status = 'done'
            })
            .addCase(createTxn.rejected, (state, action) => {
                state.createTxnRes.status = 'rejected'
            })

        builder
            .addCase(getTxns.pending, (state) => {
                state.txns.status = 'pending'
            })
            .addCase(getTxns.fulfilled, (state, action) => {
                state.txns = action.payload;
            })
            .addCase(getTxns.rejected, (state, action) => {
                state.txns.status = 'rejected'
            })

        builder
            .addCase(getSingleTxn.pending, (state) => {
                state.txn.status = 'pending'
            })
            .addCase(getSingleTxn.fulfilled, (state, action) => {
                state.txn = action.payload;
            })
            .addCase(getSingleTxn.rejected, (state, action) => {
                state.txn.status = 'rejected'
            })

        builder
            .addCase(getSigns.pending, (state) => {
                state.signatures.status = 'pending'
            })
            .addCase(getSigns.fulfilled, (state, action) => {
                state.signatures = action.payload;
            })
            .addCase(getSigns.rejected, (state, action) => {
                state.signatures.status = 'rejected'
            })

            builder
            .addCase(deleteTxn.pending, (state) => {
                state.deleteTxnRes.status = 'pending'
            })
            .addCase(deleteTxn.fulfilled, (state, action) => {
                state.deleteTxnRes = action.payload;
            })
            .addCase(deleteTxn.rejected, (state, action) => {
                state.deleteTxnRes.status = 'rejected'
            })

        builder
            .addCase(getDelegatorValidators.pending, (state) => {
                state.delegatorVals.status = 'pending'
            })
            .addCase(getDelegatorValidators.fulfilled, (state, action) => {
                console.log('action payloaddddd', action.payload)
                state.delegatorVals = action.payload;
            })
            .addCase(getDelegatorValidators.rejected, (state, action) => {
                state.delegatorVals.status = 'rejected'
            })

        builder
            .addCase(updateTxn.pending, (state) => {
                state.updateTxn.status = 'pending'
            })
            .addCase(updateTxn.fulfilled, (state, action) => {
                state.updateTxn = action.payload;
            })
            .addCase(updateTxn.rejected, (state, action) => {
                state.updateTxn.status = 'rejected'
            })

        builder
            .addCase(createSign.pending, (state) => {
                state.createSignRes.status = 'pending'
            })
            .addCase(createSign.fulfilled, (state, action) => {
                state.createSignRes = action.payload;
            })
            .addCase(createSign.rejected, (state, action) => {
                state.createSignRes.status = 'rejected'
            })
    }
})

// export const { resetState, sortValidatorsByVotingPower, resetDelegations, resetTxType } = stakeSlice.actions;

export default multiSlice.reducer;