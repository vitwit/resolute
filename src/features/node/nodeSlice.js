import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import nodeService from "./nodeService";

const initialState = {
    nodeInfo: {}
};

export const getNodeInfo = createAsyncThunk(
    "node/node-info",
    async (data, { rejectWithValue }) => {
        try {
            const response = await nodeService.fetchNodeInfo(data.baseURL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


export const nodeSlice = createSlice({
    name: "node",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNodeInfo.pending, (state) => {
                state.nodeInfo.status = 'pending'
            })
            .addCase(getNodeInfo.fulfilled, (state, action) => {
                state.nodeInfo.status = 'idle'
                state.nodeInfo.data = action?.payload;
            })
            .addCase(getNodeInfo.rejected, (state, action) => {
                state.nodeInfo.status = 'rejected'
            });
    },
});

export const { } = nodeSlice.actions;
export default nodeSlice.reducer;
