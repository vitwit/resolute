import { parseCoins } from '@cosmjs/proto-signing';
import { VOTE_TYPE_URL } from './constants';
import { GovDepositMsg } from '@/txns/gov';

export const SEND_TYPE_URL = '/cosmos.bank.v1beta1.MsgSend';
export const DELEGATE_TYPE_URL = '/cosmos.staking.v1beta1.MsgDelegate';
export const UNDELEGATE_TYPE_URL = '/cosmos.staking.v1beta1.MsgUndelegate';
export const REDELEGATE_TYPE_URL = '/cosmos.staking.v1beta1.MsgBeginRedelegate';

const voteOptionNumber: Record<string, number> = {
  yes: 1,
  no: 3,
  abstain: 2,
  veto: 4,
};

/* eslint-disable @typescript-eslint/no-explicit-any */

// parseSendMsgsFromContent returns list of parsed send messages. It returns an error
// if provided content is invalid.
export const parseSendMsgsFromContent = (
  from: string,
  content: string
): [Msg[], string] => {
  const messages = content.split('\n');

  if (messages?.length === 0) {
    return [[], 'no messages or invalid file content'];
  }

  const msgs = [];
  for (let i = 0; i < messages.length; i++) {
    try {
      const tx = parseSendTx(from, messages[i]);
      if (tx && Object.keys(tx)?.length) msgs.push(tx);
    } catch (error: any) {
      return [[], error?.message || `failed to parse message at ${i}`];
    }
  }

  return [msgs, ''];
};

const parseSendTx = (from: string, msg: string): Msg | null => {
  const values = msg.split(',');
  if (values?.length === 1) return null;
  if (values?.length !== 2) {
    throw new Error(
      `invalid message: expected ${2} values got ${values.length}`
    );
  }

  const to = values[0].trim();
  const amount = parseCoins(values[1]);

  if (amount.length === 0) {
    throw new Error('amount cannot be empty');
  }

  return {
    typeUrl: SEND_TYPE_URL,
    value: {
      fromAddress: from,
      toAddress: to,
      amount: amount,
    },
  };
};

// parseDelegateMsgsFromContent returns list of parsed delegate messages. It returns an error
// if provided content is invalid.
export const parseDelegateMsgsFromContent = (
  delegator: string,
  content: string
): [Msg[], string] => {
  const messages = content.split('\n');

  if (messages?.length === 0) {
    return [[], 'no messages or invalid file content'];
  }

  const msgs = [];
  for (let i = 0; i < messages.length; i++) {
    try {
      const msg = parseDelegateMsg(delegator, messages[i]);
      if (msg && Object.keys(msg)?.length) msgs.push(msg);
    } catch (error: any) {
      return [[], error?.message || `failed to parse message at ${i}`];
    }
  }

  return [msgs, ''];
};

const parseDelegateMsg = (delegator: string, msg: string): Msg | null => {
  const values = msg.split(',');

  if (values?.length === 1) return null;

  if (values?.length !== 2) {
    throw new Error('invalid message');
  }

  const validator = values[0].trim();
  const amount = parseCoins(values[1]);

  if (amount.length === 0) {
    throw new Error('amount cannot be empty');
  }

  return {
    typeUrl: DELEGATE_TYPE_URL,
    value: {
      delegatorAddress: delegator,
      validatorAddress: validator,
      amount: amount[0],
    },
  };
};

// parseUnDelegateMsgsFromContent returns list of parsed un-delegate messages. It returns an error
// if provided content is invalid.
export const parseUnDelegateMsgsFromContent = (
  delegator: string,
  content: string
): [Msg[], string] => {
  const messages = content.split('\n');

  if (messages?.length === 0) {
    return [[], 'no messages or invalid file content'];
  }

  const msgs = [];
  for (let i = 0; i < messages.length; i++) {
    try {
      const msg = parseUnDelegateMsg(delegator, messages[i]);
      if (msg && Object.keys(msg)?.length) msgs.push(msg);
    } catch (error: any) {
      return [[], error?.message || `failed to parse message at ${i}`];
    }
  }

  return [msgs, ''];
};

const parseUnDelegateMsg = (delegator: string, msg: string): Msg | null => {
  const values = msg.split(',');
  if (values?.length === 1) return null;

  if (values?.length !== 2) {
    throw new Error('invalid message');
  }

  const validator = values[0].trim();
  const amount = parseCoins(values[1]);

  if (amount.length === 0) {
    throw new Error('amount cannot be empty');
  }

  return {
    typeUrl: UNDELEGATE_TYPE_URL,
    value: {
      delegatorAddress: delegator,
      validatorAddress: validator,
      amount: amount[0],
    },
  };
};

// parseReDelegateMsgsFromContent returns list of parsed re-delegate messages. It returns an error
// if provided content is invalid.
export const parseReDelegateMsgsFromContent = (
  delegator: string,
  content: string
): [Msg[], string] => {
  const messages = content.split('\n');

  if (messages?.length === 0) {
    return [[], 'no messages or invalid file content'];
  }

  const msgs = [];
  for (let i = 0; i < messages.length; i++) {
    try {
      const msg = parseReDelegateMsg(delegator, messages[i]);
      if (msg && Object.keys(msg)?.length) msgs.push(msg);
    } catch (error: any) {
      return [[], error?.message || `failed to parse message at ${i}`];
    }
  }

  return [msgs, ''];
};

const parseReDelegateMsg = (delegator: string, msg: string): Msg | null => {
  const values = msg.split(',');

  if (values?.length === 1) return null;

  if (values?.length !== 3) {
    throw new Error('invalid message');
  }

  const src = values[0].trim();
  const dest = values[1].trim();
  const amount = parseCoins(values[2]);

  if (amount.length === 0) {
    throw new Error('amount cannot be empty');
  }

  return {
    typeUrl: REDELEGATE_TYPE_URL,
    value: {
      validatorDstAddress: dest,
      validatorSrcAddress: src,
      delegatorAddress: delegator,
      amount: amount[0],
    },
  };
};

// parseVoteMsgsFromContent returns list of parsed vote messages. It returns an error
// if provided content is invalid.
export const parseVoteMsgsFromContent = (
  from: string,
  content: string
): [Msg[], string] => {
  const messages = content.split('\n');

  if (messages?.length === 0) {
    return [[], 'no messages or invalid file content'];
  }

  const msgs = [];
  for (let i = 0; i < messages.length; i++) {
    try {
      const tx = parseVoteTx(from, messages[i]);
      if (tx && Object.keys(tx)?.length) msgs.push(tx);
    } catch (error: any) {
      return [[], error?.message || `failed to parse message at ${i}`];
    }
  }

  return [msgs, ''];
};

const parseVoteTx = (from: string, msg: string): Msg | null => {
  const values = msg.split(',');
  if (values?.length === 1) return null;
  if (values?.length !== 2) {
    throw new Error(
      `invalid message: expected ${2} values got ${values.length}`
    );
  }
  const proposalId = values[0].trim();
  const voteOption = voteOptionNumber?.[values[1].trim()];

  if (isNaN(Number(proposalId))) {
    throw new Error(`Invalid proposal id: ${values[0]}`);
  }

  if (!voteOption) {
    throw new Error(`Invalid vote option: ${values[1]}`);
  }

  return {
    typeUrl: VOTE_TYPE_URL,
    value: {
      voter: from,
      option: Number(voteOption),
      proposalId: Number(proposalId),
    },
  };
};

// parseDepositMsgsFromContent returns list of parsed vote messages. It returns an error
// if provided content is invalid.
export const parseDepositMsgsFromContent = (
  from: string,
  content: string
): [Msg[], string] => {
  const messages = content.split('\n');

  if (messages?.length === 0) {
    return [[], 'no messages or invalid file content'];
  }

  const msgs = [];
  for (let i = 0; i < messages.length; i++) {
    try {
      const tx = parseDepositTx(from, messages[i]);
      if (tx && Object.keys(tx)?.length) msgs.push(tx);
    } catch (error: any) {
      return [[], error?.message || `failed to parse message at ${i}`];
    }
  }

  return [msgs, ''];
};

const parseDepositTx = (from: string, msg: string): Msg | null => {
  const values = msg.split(',');
  if (values?.length === 1) return null;
  if (values?.length !== 2) {
    throw new Error(
      `invalid message: expected ${2} values got ${values.length}`
    );
  }

  const proposalId = values[0].trim();
  const parsedProposalId = Number(proposalId);
  if (isNaN(parsedProposalId)) {
    throw new Error(`Invalid proposal id: ${values[0]}`);
  }

  const amount = parseCoins(values[1]);

  if (amount.length === 0) {
    throw new Error('amount cannot be empty');
  }

  const depositMsg = GovDepositMsg(
    parsedProposalId,
    from,
    Number(amount[0].amount),
    amount[0].denom
  );

  return depositMsg;
};
