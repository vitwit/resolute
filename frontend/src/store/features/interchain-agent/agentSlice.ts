'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AgentState {
  agentOpen: boolean;
}

const initialState: AgentState = {
  agentOpen: false,
};

export const agentSlice = createSlice({
  name: 'interchain-agent',
  initialState,
  reducers: {
    toggleAgentDialog: (state) => {
      state.agentOpen = !state.agentOpen;
    },
  },
});

export const { toggleAgentDialog } = agentSlice.actions;

export default agentSlice.reducer;
