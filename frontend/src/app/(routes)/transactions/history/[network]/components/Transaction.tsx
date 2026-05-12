import React, { useState } from 'react';
import TransactionHeader from './TransactionHeader';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { getLocalTime } from '@/utils/dataTime';
import NumberFormat from '@/components/common/NumberFormat';
import { get } from 'lodash';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import TxMsg from './TxMsg';
import { getTxnURL, parseTxnData } from '@/utils/util';
import { buildMessages } from '@/utils/transaction';
import { txRepeatTransaction } from '@/store/features/recent-transactions/recentTransactionsSlice';
import DialogLoader from '@/components/common/DialogLoader';
import { TxStatus } from '@/types/enums';
import CustomDialog from '@/components/common/CustomDialog';

const Transaction = ({
  chainName,
  hash,
  chainID,
  isSearchPage = false,
}: {
  chainName: string;
  hash: string;
  chainID: string;
  isSearchPage?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);
  const { chainLogo, explorerTxHashEndpoint } = basicChainInfo;

  const txnRepeatStatus = useAppSelector(
    (state) => state.recentTransactions?.txnRepeat?.status
  );
  const loading = txnRepeatStatus === TxStatus.PENDING;

  const txnResult = useAppSelector(
    (state: RootState) => state.recentTransactions.txn?.data?.[0]
  );
  const { success = false, messages = [] } = txnResult
    ? parseTxnData(txnResult)
    : {};
  const formattedMessages = messages ? buildMessages(messages) : [];
  const disableAction = formattedMessages.length === 0 || !success;

  const [viewRawOpen, setViewRawOpen] = useState(false);

  const onRepeatTxn = () => {
    dispatch(
      txRepeatTransaction({
        basicChainInfo,
        feegranter: '',
        messages: formattedMessages,
      })
    );
  };

  const getAmount = (amount: number) => {
    const { decimals, displayDenom } = getDenomInfo(chainID);

    return {
      amount: (amount / 10 ** decimals).toFixed(6),
      denom: displayDenom,
    };
  };

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const msgs = txnResult?.messages;

  return (
    <div>
      <TransactionHeader
        hash={hash}
        rawLog={txnResult?.raw_log}
        status={success ? 'success' : 'failed'}
        onRepeatTxn={onRepeatTxn}
        disableAction={disableAction}
        goBackUrl={`/transactions/history/${chainName.toLowerCase()}`}
        isSearchPage={isSearchPage}
        mintscanURL={getTxnURL(explorerTxHashEndpoint, hash || '')}
      />
      <div className="flex gap-10 w-full">
        <div className="flex-1 flex w-full">
          <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-2 gap-6">
              <div className="txn-history-card">
                <p className="text-b1-light">Network</p>
                <div className="flex gap-2 items-center">
                  <Image
                    src={chainLogo}
                    width={24}
                    height={24}
                    alt="network-logo"
                    className="w-6 h-6"
                  />
                  <p className="text-h2 font-bold capitalize">{chainName}</p>
                </div>
              </div>
              <div className="txn-history-card">
                <p className="text-b1-light">Fees</p>
                <div className="text-h2 font-bold">
                  <NumberFormat
                    cls=""
                    type="token"
                    value={
                      getAmount(Number(get(txnResult, 'fee[0].amount', 0)))
                        .amount
                    }
                    token={
                      getAmount(Number(get(txnResult, 'fee[0].amount', 0)))
                        .denom
                    }
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-between">
              <div className="text-b1-light">Messages: {msgs?.length}</div>
              <div>
                <button
                  onClick={() => setViewRawOpen(true)}
                  className="secondary-btn"
                >
                  View JSON
                </button>
              </div>
            </div>
            {msgs?.map((msg, mIndex) => (
              <TxMsg
                key={mIndex}
                msg={msg}
                mIndex={mIndex}
                chainID={chainID}
                expandedIndex={expandedIndex}
                toggleExpand={toggleExpand}
              />
            ))}
          </div>
        </div>

        {/* Sidebar content */}
        <div className="flex flex-col gap-10">
          <div className="txn-history-card w-[352px]">
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-b1-light">Gas Used / Wanted</p>
              <div className="text-b1 font-bold">
                <span>{txnResult?.gas_used || 0}</span>
                <span>/</span>
                <span>{txnResult?.gas_wanted || 0}</span>
              </div>
            </div>
          </div>

          <div className="txn-history-card w-[352px]">
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-b1-light">TimeStamp</p>
              <div className="text-b1 font-bold">
                {getLocalTime(txnResult?.timestamp || '')}
              </div>
            </div>
          </div>

          <div className="txn-history-card w-[352px]">
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-b1-light">Height</p>
              <div className="text-b1 font-bold">{txnResult?.height}</div>
            </div>
          </div>

          <div className="txn-history-card w-[352px]">
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-b1-light">Memo</p>
              <div className="text-b1 font-bold">{txnResult?.memo || '-'}</div>
            </div>
          </div>
        </div>
      </div>
      <DialogLoader open={loading} loadingText="Pending" />
      <CustomDialog
        open={viewRawOpen}
        onClose={() => setViewRawOpen(false)}
        title="Raw Transaction"
      >
        <div className="w-[800px] bg-black h-[400px] max-h-[400px] overflow-y-scroll p-2">
          {txnResult ? (
            <pre>{JSON.stringify(txnResult, undefined, 2)}</pre>
          ) : (
            <div className="text-center">- No Data -</div>
          )}
        </div>
      </CustomDialog>
    </div>
  );
};

export default Transaction;
