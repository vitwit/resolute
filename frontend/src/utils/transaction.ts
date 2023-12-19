import {
  msgSendTypeUrl,
  serialize as serializeMsgSend,
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
    default:
      return 'Todo: add type';
  }
};

export const serializeMsg = (msg: Msg): string => {
  if (!msg) return 'No Message';
  switch (msg.typeUrl) {
    case msgDelegate:
      return serializeMsgDelegate(msg);
    case msgUnDelegate:
      return serializeMsgUndelegte(msg);
    case msgReDelegate:
      return serializeMsgRedelegte(msg);
    case msgSendTypeUrl:
      return serializeMsgSend(msg);
    case msgWithdrawRewards:
      return serializeMsgClaim(msg);
    case msgTransfer:
      return serializeMsgTransfer(msg);
    default:
      return `Todo: serialize message ${msg.typeUrl}`;
  }
};

export const formatTransaction = (tx: Transaction, msgFilters: string[]) => {
  const msgs = tx.msgs;
  const showMsgs: [string, string, boolean] = ['', '', false];
  if (msgs[0]) {
    showMsgs[0] = MsgType(msgs[0].typeUrl);
  }
  if (msgs[1]) {
    showMsgs[1] = MsgType(msgs[1].typeUrl);
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
      if (filterSet.has(MsgType(msg.typeUrl))) showTx = true;
    });
  }

  const msgCount = msgs.length;
  const isTxSuccess = tx.code === 0;
  const time = getTimeDifference(tx.time);
  const firstMessage = serializeMsg(tx.msgs[0]);
  return {
    showMsgs,
    isTxSuccess,
    time,
    firstMessage,
    msgCount,
    showTx,
    isIBC: tx.isIBC,
    isIBCPending: tx.isIBCPending,
  };
};
