import {
  msgSendTypeUrl,
  SendMsg,
  formattedSerialize as serializeMsgSend,
} from '@/txns/bank/send';
import {
  msgWithdrawRewards,
  serialize as serializeMsgClaim,
  WithdrawAllRewardsMsg,
} from '@/txns/distribution/withDrawRewards';
import {
  Delegate,
  msgDelegate,
  serialize as serializeMsgDelegate,
} from '@/txns/staking/delegate';
import {
  msgReDelegate,
  Redelegate,
  serialize as serializeMsgRedelegte,
} from '@/txns/staking/redelegate';
import {
  msgUnDelegate,
  serialize as serializeMsgUndelegte,
  UnDelegate,
} from '@/txns/staking/undelegate';
import { getTimeDifference } from './dataTime';
import {
  msgTransfer,
  serialize as serializeMsgTransfer,
} from '@/txns/ibc/transfer';
import { serialize as serializeMsgExec } from '@/txns/authz/exec';
import { msgAuthzExecTypeUrl } from '@/txns/authz/exec';
import {
  msgAuthzGrantTypeUrl,
  serializeMsgGrantAuthz,
} from '@/txns/authz/grant';
import {
  msgFeegrantGrantTypeUrl,
  serializeMsgGrantAllowance,
} from '@/txns/feegrant/grant';
import { GovVoteMsg, msgVoteTypeUrl, serializeMsgVote } from '@/txns/gov/vote';
import {
  GovDepositMsg,
  msgDepositTypeUrl,
  serializeMsgDeposit,
} from '@/txns/gov/deposit';
import { voteOptionNumber, voteOptions } from './constants';

export function NewTransaction(
  txResponse: ParsedTxResponse,
  msgs: Msg[],
  chainID: string,
  address: string,
  isIBC?: boolean,
  isIBCPending?: boolean
): Transaction {
  const transaction: Transaction = {
    code: txResponse.code,
    transactionHash: txResponse.transactionHash,
    height: txResponse.height || '-',
    rawLog: txResponse.rawLog || '-',
    gasUsed: txResponse.gasUsed || '-',
    gasWanted: txResponse.gasWanted || '-',
    fee: txResponse.fee || [],
    time: txResponse.time || new Date().toISOString(),
    msgs,
    chainID,
    address,
    memo: txResponse.memo || '',
    isIBC: !!isIBC,
    isIBCPending: !!isIBCPending,
  };
  return transaction;
}

export const MsgType = (msg: string): string => {
  switch (msg) {
    case msgDelegate:
      return 'Delegate';
    case msgUnDelegate:
      return 'Un-delegate';
    case msgReDelegate:
      return 'Re-delegate';
    case msgSendTypeUrl:
      return 'Send';
    case msgWithdrawRewards:
      return 'Claim';
    case msgTransfer:
      return 'IBC';
    case msgAuthzExecTypeUrl:
      return 'Authz-permission';
    case msgAuthzGrantTypeUrl:
      return 'Grant-Authz';
    case msgFeegrantGrantTypeUrl:
      return 'Grant-Allowance';
    case msgVoteTypeUrl:
      return 'Vote';
    case msgDepositTypeUrl:
      return 'Deposit';
    default:
      return msg;
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const serializeMsg = (
  msg: any,
  decimals: number,
  originDenom: string,
  txHash: string
): string => {
  if (!msg) return 'No Message';
  switch (msg['@type']) {
    case msgDelegate:
      return serializeMsgDelegate(msg, decimals, originDenom);
    case msgUnDelegate:
      return serializeMsgUndelegte(msg, decimals, originDenom);
    case msgReDelegate:
      return serializeMsgRedelegte(msg, decimals, originDenom);
    case msgSendTypeUrl:
      return serializeMsgSend(msg, decimals, originDenom, true);
    case msgWithdrawRewards:
      return serializeMsgClaim(msg);
    case msgTransfer:
      return serializeMsgTransfer(msg, decimals, originDenom);
    case msgAuthzExecTypeUrl:
      return serializeMsgExec();
    case msgAuthzGrantTypeUrl:
      return serializeMsgGrantAuthz(msg);
    case msgFeegrantGrantTypeUrl:
      return serializeMsgGrantAllowance(msg);
    case msgVoteTypeUrl:
      return serializeMsgVote(msg);
    case msgDepositTypeUrl:
      return serializeMsgDeposit(msg, decimals, originDenom);
    default:
      return txHash;
  }
};

export const formatTransaction = (
  tx: ParsedTransaction,
  msgFilters: string[],
  decimals: number,
  originDenom: string
) => {
  const msgs = tx.messages;
  const showMsgs: [string, string, boolean] = ['', '', false];
  if (msgs[0]) {
    showMsgs[0] = MsgType(msgs[0]?.['@type']);
  }
  if (msgs[1]) {
    showMsgs[1] = MsgType(msgs[1]?.['@type']);
  }
  if (msgs.length > 2) {
    showMsgs[2] = true;
  }
  let showTx = false;
  if (!msgFilters.length) showTx = true;
  else {
    const filterSet = new Set(msgFilters);
    if (!msgs.length) showTx = true;
    msgs.forEach((msg) => {
      if (filterSet.has(MsgType(msg['@type']))) showTx = true;
    });
  }

  const msgCount = msgs.length;
  const isTxSuccess = tx.code === 0;
  const time = getTimeDifference(tx.timestamp);
  const firstMessage = serializeMsg(
    tx.messages[0],
    decimals,
    originDenom,
    tx.txhash
  );
  return {
    showMsgs,
    isTxSuccess,
    time,
    firstMessage,
    msgCount,
    showTx,
    isIBC: tx.isIBCTxn,
    isIBCPending: tx.isIBCPending,
  };
};

export const NewIBCTransaction = (
  txResponse: ParsedTxResponse,
  msgs: Msg[],
  chainID: string,
  address: string,
  isIBC?: boolean,
  isIBCPending?: boolean
): ParsedTransaction => {
  const transaction: ParsedTransaction = {
    code: txResponse.code,
    txhash: txResponse.transactionHash,
    height: txResponse.height || '-',
    raw_log: txResponse.rawLog || '-',
    gas_used: txResponse.gasUsed || '-',
    gas_wanted: txResponse.gasWanted || '-',
    fee: txResponse.fee || [],
    timestamp: txResponse.time || new Date().toISOString(),
    messages: [msgs[0]?.value],
    chain_id: chainID,
    address,
    memo: txResponse.memo || '',
    isIBCTxn: !!isIBC,
    isIBCPending: !!isIBCPending,
  };
  return transaction;
};

export const formattedMsgType = (msgType: string) => {
  if (!msgType) return 'No Message';
  switch (msgType) {
    case msgDelegate:
      return 'Delegate';
    case msgUnDelegate:
      return 'UnDelegate';
    case msgReDelegate:
      return 'ReDelegate';
    case msgSendTypeUrl:
      return 'Send';
    case msgWithdrawRewards:
      return 'Claim Rewards';
    case msgTransfer:
      return 'IBC Send';
    case msgAuthzExecTypeUrl:
      return 'Exec Authz';
    case msgAuthzGrantTypeUrl:
      return 'Grant Authz';
    case msgFeegrantGrantTypeUrl:
      return 'Grant Allowance';
    case msgVoteTypeUrl:
      return 'Vote';
    case msgDepositTypeUrl:
      return 'Deposit';
    default:
      return msgType.split('.').slice(-1)?.[0] || msgType;
  }
};

export const buildMessages = (messages: any[]): Msg[] => {
  const result: Msg[] = [];
  messages.forEach((msg) => {
    const formattedMsg = getMessage(msg);
    if (formattedMsg) result.push(formattedMsg);
  });
  return result;
};

const getDelegateMsg = (message: any) => {
  const { amount, validator_address, delegator_address } = message;
  const { amount: delegationAmount, denom } = amount;
  const msg = Delegate(
    delegator_address,
    validator_address,
    delegationAmount,
    denom
  );
  return msg;
};

const getUndelegateMsg = (message: any) => {
  const { amount, validator_address, delegator_address } = message;
  const { amount: undelegationAmount, denom } = amount;
  const msg = UnDelegate(
    delegator_address,
    validator_address,
    undelegationAmount,
    denom
  );
  return msg;
};

const getRedelegateMsg = (message: any) => {
  const {
    validator_src_address,
    validator_dst_address,
    delegator_address,
    amount,
  } = message;
  const { amount: delegationAmount, denom } = amount;
  const msg = Redelegate(
    delegator_address,
    validator_src_address,
    validator_dst_address,
    delegationAmount,
    denom
  );
  return msg;
};

const getSendMsg = (message: any) => {
  const { to_address, amount, from_address } = message;
  const { amount: sendAmount, denom } = amount[0];
  const msg = SendMsg(from_address, to_address, sendAmount, denom);
  return msg;
};

const getVoteMsg = (message: any) => {
  const { option, proposal_id, voter } = message;
  const voteOption = voteOptions?.[option] || '';
  const vote = voteOptionNumber[voteOption] || -1;
  const msg = GovVoteMsg(proposal_id, voter, vote);
  return msg;
};

const getDepositMsg = (message: any) => {
  const { proposal_id, depositor, amount } = message;
  const { amount: depositAmount, denom } = amount[0];
  const msg = GovDepositMsg(proposal_id, depositor, depositAmount, denom);
  return msg;
};

const getWithdrawRewardsMsg = (message: any) => {
  const { delegator_address, validator_address } = message;
  const msg = WithdrawAllRewardsMsg(delegator_address, validator_address);
  return msg;
};

export const getMessage = (message: any) => {
  const msgType = message?.['@type'];
  switch (msgType) {
    case msgDelegate:
      return getDelegateMsg(message);
    case msgUnDelegate:
      return getUndelegateMsg(message);
    case msgReDelegate:
      return getRedelegateMsg(message);
    case msgSendTypeUrl:
      return getSendMsg(message);
    case msgWithdrawRewards:
      return getWithdrawRewardsMsg(message);
    case msgTransfer:
      return null;
    case msgAuthzExecTypeUrl:
      return null;
    case msgAuthzGrantTypeUrl:
      return null;
    case msgFeegrantGrantTypeUrl:
      return null;
    case msgVoteTypeUrl:
      return getVoteMsg(message);
    case msgDepositTypeUrl:
      return getDepositMsg(message);
    default:
      return null;
  }
};
