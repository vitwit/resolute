import {
  msgSendTypeUrl,
  formattedSerialize as serializeMsgSend,
} from '@/txns/bank/send';
import {
  msgWithdrawRewards,
  serialize as serializeMsgClaim,
} from '@/txns/distribution/withDrawRewards';
import {
  msgDelegate,
  serialize as serializeMsgDelegate,
} from '@/txns/staking/delegate';
import {
  msgReDelegate,
  serialize as serializeMsgRedelegte,
} from '@/txns/staking/redelegate';
import {
  msgUnDelegate,
  serialize as serializeMsgUndelegte,
} from '@/txns/staking/undelegate';
import { getTimeDifference } from './dataTime';
import {
  msgTransfer,
  serialize as serializeMsgTransfer,
} from '@/txns/ibc/transfer';
import { serialize as serializeMsgExec } from '@/txns/authz/exec';
import { msgAuthzExecTypeUrl } from '@/txns/authz/exec';

export function NewTransaction(
  txResponse: ParsedTxResponse,
  msgs: Msg[],
  chainID: string,
  address: string,
  isIBC?: boolean,
  isIBCPending?: boolean
): Transaction  {
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
    default:
      return 'Todo: add type';
  }
};

export const serializeMsg = (
  msg: any,
  decimals: number,
  originDenom: string
): string => {
  if (!msg) return 'No Message';
  switch (msg["@type"]) {
    case msgDelegate:
      return serializeMsgDelegate(msg);
    case msgUnDelegate:
      return serializeMsgUndelegte(msg);
    // case msgReDelegate:
    //   return serializeMsgRedelegte(msg);
    case msgSendTypeUrl:
      return serializeMsgSend(msg, decimals, originDenom, true);
    // case msgWithdrawRewards:
    //   return serializeMsgClaim(msg);
    case msgTransfer:
      return serializeMsgTransfer(msg, decimals, originDenom);
    // case msgAuthzExecTypeUrl:
    //   return serializeMsgExec();
    default:
      return `Todo: serialize message ${msg.typeUrl}`;
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
    showMsgs[0] = MsgType(msgs[0]['@type']);
  }
  if (msgs[1]) {
    showMsgs[1] = MsgType(msgs[1]['@type']);
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
  const firstMessage = serializeMsg(tx.messages[0], decimals, originDenom);
  return {
    showMsgs,
    isTxSuccess,
    time,
    firstMessage,
    msgCount,
    showTx,
    isIBC: false,
    isIBCPending: false,
  };
};
