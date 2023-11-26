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
    time: txResponse.time || '-',
    msgs,
    chainID,
    address,
  };
  return transaction;
}

const MsgType = (msg: string): string => {
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

const serializeMsg = (msg: Msg): string => {
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

function getTimeDifference(timestamp: string): string {
  const now: Date = new Date();
  const timestampDate: Date = new Date(timestamp);
  const timeDifference: number = now.getTime() - timestampDate.getTime();
  const seconds: number = Math.floor(timeDifference / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);
  const months: number = Math.floor(days / 30);
  const years: number = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}

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
  const isTxSuccess = tx.code === 0;
  const time = getTimeDifference(tx.time);
  const firstMessage = serializeMsg(tx.msgs[0]);
  return {
    showMsgs,
    isTxSuccess,
    time,
    firstMessage,
  };
};
