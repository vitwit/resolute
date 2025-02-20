import Axios, { AxiosResponse } from 'axios';
import { cleanURL } from '../../../utils/util';
import { VALOREN_API_URL } from '@/utils/constants';

/**
 * Type representing an action.
 */
export interface Action {
  id: string;
  user_id: string;
  chain_id: string;
  interval: string;
  type: ActionType;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  payload: Record<string, any>;
  last_executed: string | null;
  next_execution: string | null;
  status: string;
}

/**
 * Enum representing the type of an action.
 */
export enum ActionType {
  RESTAKE = 'restake',
  REDELEGATE = 'redelegate',
}

/**
 * Payload required to register a new action.
 * Excludes fields automatically generated or managed by the system.
 */
export interface RegisterActionPayload {
  user_id: string;
  chain_id: string;
  interval: number;
  type: ActionType;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  payload: Record<string, any>;
}

const BASE_URL: string = cleanURL(VALOREN_API_URL);

const CREATE_ACTION_URL = `${BASE_URL}/api/actions`;
const GET_ACTIONS_BY_USER_URL = (userId: string): string =>
  `${BASE_URL}/api/actions/${userId}`;

/**
 * Registers a new action.
 * @param payload - The payload to register an action.
 * @returns A promise with Axios response containing the created action.
 */

export const registerAction = (
  payload: RegisterActionPayload,
  xPubKey: string,
  authorization: string
): Promise<AxiosResponse<Action>> => {
  return Axios.post(CREATE_ACTION_URL, payload, {
    headers: {
      'x-pubkey': xPubKey,
      Authorization: `Bearer ${authorization}`,
    },
  });
};

/**
 * Fetches all actions for a specific user.
 * @param userId - The ID of the user whose actions are to be fetched.
 * @returns A promise with Axios response containing the list of actions.
 */
export const getActionsByUser = (
  userId: string
): Promise<AxiosResponse<Action[]>> => {
  console.log('...', GET_ACTIONS_BY_USER_URL(userId));
  return Axios.get(GET_ACTIONS_BY_USER_URL(userId));
};

export default {
  registerAction,
  getActionsByUser,
};
