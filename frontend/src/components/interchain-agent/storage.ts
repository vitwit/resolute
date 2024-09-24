import { SessionItem } from '@/store/features/interchain-agent/agentSlice';

export const loadFromLocalStorage = (): Record<string, SessionItem> => {
  try {
    const storedData = localStorage.getItem('queries');
    return storedData ? JSON.parse(storedData) : {};
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {};
  }
};

export const saveToLocalStorage = (
  sessionID: string,
  sessionItem: SessionItem
) => {
  try {
    const storedData = localStorage.getItem('queries');
    const queries = storedData ? JSON.parse(storedData) : {};

    queries[sessionID] = sessionItem;

    localStorage.setItem('queries', JSON.stringify(queries));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const clearChatHistory = () => {
  localStorage.removeItem('queries');
};
