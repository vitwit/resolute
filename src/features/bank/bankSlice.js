import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchBalances } from './bankAPI';

const initialState = {
  balances: [],
  status: 'idle',
  errMsg: '',
  loading: false,
};

export const getBalances = createAsyncThunk(
  'bank/balances',
  async (data) => {
    const response = await fetchBalances(data.baseURL, data.address, data.key, data.limit);
    return response.data;
  }
);

export const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBalances.pending, (state) => {
        state.status = 'loading';
        state.errMsg = ''
        state.loading = true

      })
      .addCase(getBalances.fulfilled, (state, action) => {
        state.status = 'idle';
        state.balances = action.payload
        state.errMsg = ''
        state.loading = false
      })
      .addCase(getBalances.rejected, (state, action) => {
        state.status = 'rejected';
        state.errMsg = action.error.message
        state.loading = false
      })

      
  },
});

export const { balances } = bankSlice.actions;

export default bankSlice.reducer;
