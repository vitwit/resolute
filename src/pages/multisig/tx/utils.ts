import { parseCoins } from "@cosmjs/proto-signing";
import { Msg } from "../../../txns/types";

export const SEND_TYPE_URL = "/cosmos.bank.v1beta1.MsgSend";
export const DELEGATE_TYPE_URL = "/cosmos.staking.v1beta1.MsgDelegate";
export const UNDELEGATE_TYPE_URL = "/cosmos.staking.v1beta1.MsgUndelegate";
export const REDELEGATE_TYPE_URL = "/cosmos.staking.v1beta1.MsgBeginRedelegate";

// parseSendMsgsFromContent returns list of parsed send messages. It returns an error
// if provided content is invalid.
export const parseSendMsgsFromContent = (
  from: string,
  content: string
): [Msg[], string] => {
  const messages = content.split("\n");

  if (messages.length === 0) {
    return [[], "no messages found"];
  }

  const msgs = [];
  for (let i = 0; i < messages.length; i++) {
    try {
      const tx = parseSendTx(from, messages[i]);
      msgs.push(tx);
    } catch (error: any) {
      return [[], error || `failed to parse message at ${i}`];
    }
  }

  return [msgs, ""];
};

const parseSendTx = (from: string, msg: string): Msg => {
  const values = msg.split(",");
  if (values.length != 2) {
    throw new Error(
      `invalid message: expected ${2} values got ${values.length}`
    );
  }

  const to = values[0];
  const amount = parseCoins(values[1]);

  if (amount.length === 0) {
    throw new Error("amount cannot be empty");
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
  const messages = content.split("\n");

  if (messages.length === 0) {
    return [[], "no messages found"];
  }

  const msgs = [];
  for (let i = 0; i < messages.length; i++) {
    try {
      const msg = parseDelegateMsg(delegator, messages[i]);
      msgs.push(msg);
    } catch (error: any) {
      return [[], error || `failed to parse message at ${i}`];
    }
  }

  return [msgs, ""];
};

const parseDelegateMsg = (delegator: string, msg: string): Msg => {
  const values = msg.split(",");
  if (values.length !== 2) {
    throw new Error("invalid message");
  }

  const validator = values[0];
  const amount = parseCoins(values[1]);

  if (amount.length === 0) {
    throw new Error("amount cannot be empty");
  }

  return {
    typeUrl: DELEGATE_TYPE_URL,
    value: {
      delegatorAddress: delegator,
      validatorAddress: validator,
      amount: amount,
    },
  };
};

// parseUnDelegateMsgsFromContent returns list of parsed un-delegate messages. It returns an error
// if provided content is invalid.
export const parseUnDelegateMsgsFromContent = (
  delegator: string,
  content: string
): [Msg[], string] => {
  const messages = content.split("\n");

  if (messages.length === 0) {
    return [[], "no messages found"];
  }

  const msgs = [];
  for (let i = 0; i < messages.length; i++) {
    try {
      const msg = parseUnDelegateMsg(delegator, messages[i]);
      msgs.push(msg);
    } catch (error: any) {
      return [[], error || `failed to parse message at ${i}`];
    }
  }

  return [msgs, ""];
};

const parseUnDelegateMsg = (delegator: string, msg: string): Msg => {
  const values = msg.split(",");
  if (values.length !== 2) {
    throw new Error("invalid message");
  }

  const validator = values[0];
  const amount = parseCoins(values[1]);

  if (amount.length === 0) {
    throw new Error("amount cannot be empty");
  }

  return {
    typeUrl: UNDELEGATE_TYPE_URL,
    value: {
      delegatorAddress: delegator,
      validatorAddress: validator,
      amount: amount,
    },
  };
};

// parseReDelegateMsgsFromContent returns list of parsed re-delegate messages. It returns an error
// if provided content is invalid.
export const parseReDelegateMsgsFromContent = (
  delegator: string,
  content: string
): [Msg[], string] => {
  const messages = content.split("\n");

  if (messages.length === 0) {
    return [[], "no messages found"];
  }

  const msgs = [];
  for (let i = 0; i < messages.length; i++) {
    try {
      const msg = parseReDelegateMsg(delegator, messages[i]);
      msgs.push(msg);
    } catch (error: any) {
      return [[], error || `failed to parse message at ${i}`];
    }
  }

  return [msgs, ""];
};

const parseReDelegateMsg = (delegator: string, msg: string): Msg => {
  const values = msg.split(",");
  if (values.length !== 3) {
    throw new Error("invalid message");
  }

  const src = values[0];
  const dest = values[1];
  const amount = parseCoins(values[2]);

  if (amount.length === 0) {
    throw new Error("amount cannot be empty");
  }

  return {
    typeUrl: REDELEGATE_TYPE_URL,
    value: {
      validatorDstAddress: dest,
      validatorSrcAddress: src,
      delegatorAddress: delegator,
      amount: amount,
    },
  };
};
