import React from 'react';
import Copy from '@/components/common/Copy';
import { parseTxnData, shortenString } from '@/utils/util';
import NewTxnMsg from '@/components/NewTxnMsg';
import Link from 'next/link';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { buildMessages, formattedMsgType } from '@/utils/transaction';
import { txRepeatTransaction } from '@/store/features/recent-transactions/recentTransactionsSlice';
import CustomButton from '@/components/common/CustomButton';
import TxnTimeStamp from './TxnTimeStamp';

const TransactionCard = ({
  txn,
  currency,
  basicChainInfo,
}: {
  txn: ParsedTransaction;
  currency: Currency;
  basicChainInfo: BasicChainInfo;
}) => {
  const dispatch = useAppDispatch();
  const { success, messages, txHash, timeStamp } = parseTxnData(txn);
  const formattedMessages = buildMessages(messages);
  const disableAction = formattedMessages.length === 0 || !success;
  const onRepeatTxn = () => {
    dispatch(
      txRepeatTransaction({
        basicChainInfo,
        feegranter: '',
        messages: formattedMessages,
      })
    );
  };
  return (
    <div className="flex gap-6">
      <TxnTimeStamp success={success} timeStamp={timeStamp} />
      <div className="txn-card flex-1 gap-10">
        <div className="space-y-6 flex-1">
          <div className="flex justify-between w-[70%]">
            <div className="flex items-center gap-1">
              <Link
                className="capitalize hover:underline"
                href={`/transactions/history/${basicChainInfo.chainName.toLowerCase()}/${txHash}`}
              >
                <p className="text-b1">{shortenString(txHash, 24)}</p>
              </Link>
              <Copy content={txHash} />
            </div>
            <div className="flex flex-wrap gap-4 w-[50%]">
              {txn?.messages?.map((msg, index) => (
                <div key={index} className="txn-permission-card">
                  <span className="text-b1">
                    {formattedMsgType(msg?.['@type'])}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <NewTxnMsg
              msgs={txn?.messages || []}
              currency={currency}
              failed={!success}
            />
          </div>
        </div>
        <CustomButton
          btnText={txn?.code === 0 ? 'Repeat' : 'Retry'}
          btnDisabled={disableAction}
          btnOnClick={onRepeatTxn}
          btnStyles={`min-w-[82px] ${disableAction ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );
};

export default TransactionCard;
