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

export function NewTransaction(
  txResponse: ParsedTxResponse,
  msgs: Msg[],
  chainID: string,
  address: string
): Transaction {
  const transaction: Transaction = {
    code: 0,
    transactionHash: txResponse.transactionHash,
    height: txResponse.height || '-',
    rawLog: txResponse.rawLog || '-',
    gasUsed: txResponse.gasUsed || '-',
    gasWanted: txResponse.gasWanted || '-',
    fee: txResponse.fee || [],
    time: txResponse.time || new Date().toTimeString(),
    msgs,
    chainID,
    address,
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
      return 'Re-delate';
    case msgSendTypeUrl:
      return 'Send';
    case msgWithdrawRewards:
      return 'Claim';
    default:
      return 'Todo: add type';
  }
};

export const serializeMsg = (msg: Msg): string => {
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
    default:
      return `Todo: serialize message ${msg.typeUrl}`;
  }
};

export const formatTransaction = (tx: Transaction) => {
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
  };
};
