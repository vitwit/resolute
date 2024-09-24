'use client';

import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from '@/components/interchain-agent/storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SessionState {
  [key: string]: SessionItem;
}

export interface Queries {
  [key: string]: {
    result: string;
    status: string;
    errMessage: string;
    date: string;
  };
}

export interface SessionItem {
  date: string;
  requests: Queries;
}
export interface AgentState {
  agentOpen: boolean;
  currentSessionID: string;
  sessionState: SessionState;
  currentSession: SessionItem | undefined;
  groupedSessions: Record<string, any>;
}

const initialState: AgentState = {
  agentOpen: false,
  currentSessionID: '',
  sessionState: {},
  currentSession: undefined,
  groupedSessions: {},
};

const getGroupedSessionsByDate = (
  sessionState: SessionState
): Record<string, any> => {
  const groupedSessions: Record<string, any> = {};

  Object.keys(sessionState).forEach((sessionID) => {
    const session = sessionState[sessionID];
    const fullDate = session.date;

    // Extract just the date part (YYYY-MM-DD) from the full date
    const dateOnly = new Date(fullDate).toISOString().split('T')[0];

    // Get the first request value from the requests object
    const firstRequestKey = Object.keys(session.requests)[0];
    const firstRequest = session.requests[firstRequestKey];

    // Group sessions by the extracted date
    if (!groupedSessions[dateOnly]) {
      groupedSessions[dateOnly] = [];
    }

    groupedSessions[dateOnly].push({
      sessionID,
      firstRequest: {
        key: firstRequestKey,
        value: firstRequest,
      },
    });
  });

  // Sort dates in descending order
  const sortedGroupedSessions = Object.keys(groupedSessions)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .reduce((acc: Record<string, any>, date) => {
      acc[date] = groupedSessions[date];
      return acc;
    }, {});

  return sortedGroupedSessions;
};

export const addSessionItem = createAsyncThunk<
  void,
  { sessionID: string; request: Queries }
>('agent/addSessionItem', async ({ sessionID, request }, { dispatch }) => {
  const updatedRequest: Queries = {};
  Object.keys(request).forEach((key) => {
    updatedRequest[key] = {
      ...request[key],
      date: new Date().toISOString(),
    };
  });

  // Load existing state
  const storedSessionState: SessionState = loadFromLocalStorage();

  if (storedSessionState[sessionID]) {
    storedSessionState[sessionID].requests = {
      ...storedSessionState[sessionID].requests,
      ...updatedRequest,
    };
  } else {
    storedSessionState[sessionID] = {
      date: new Date().toISOString(),
      requests: updatedRequest,
    };
  }

  // Save updated state
  saveToLocalStorage(sessionID, storedSessionState[sessionID]);

  // Dispatch actions to update state
  dispatch(updateSessionState(storedSessionState));
  dispatch(updateCurrentSession(storedSessionState[sessionID]));

  // Dispatch loadSessionStateFromLocalStorage to update grouped sessions
  dispatch(loadSessionStateFromLocalStorage());
});

export const agentSlice = createSlice({
  name: 'interchain-agent',
  initialState,
  reducers: {
    toggleAgentDialog: (state) => {
      state.agentOpen = !state.agentOpen;
    },
    updateSessionState: (state, action: PayloadAction<SessionState>) => {
      state.sessionState = action.payload;
    },
    updateCurrentSession: (state, action: PayloadAction<SessionItem>) => {
      state.currentSession = action.payload;
    },
    loadSessionStateFromLocalStorage: (state) => {
      const storedSessionState = loadFromLocalStorage();
      state.sessionState = storedSessionState;
      state.groupedSessions = getGroupedSessionsByDate(storedSessionState);
    },
    setCurrentSessionID: (state, action: PayloadAction<string>) => {
      state.currentSessionID = action.payload;
    },
    setCurrentSession: (
      state,
      action: PayloadAction<{ data: SessionItem }>
    ) => {
      state.currentSession = action.payload.data;
    },
    resetChat: (state) => {
      state.currentSession = undefined;
      state.groupedSessions = {};
    },
  },
});

export const {
  toggleAgentDialog,
  loadSessionStateFromLocalStorage,
  updateCurrentSession,
  updateSessionState,
  setCurrentSessionID,
  setCurrentSession,
  resetChat
} = agentSlice.actions;

export default agentSlice.reducer;
