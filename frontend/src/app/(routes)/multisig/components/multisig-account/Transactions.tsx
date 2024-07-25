import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getTxns } from '@/store/features/multisig/multisigSlice';
import { Txn } from '@/types/multisig';
import React, { useEffect, useState } from 'react';
import { TxStatus } from '@/types/enums';
import TxnsCard from '../common/TxnsCard';
import useFetchTxns from '@/custom-hooks/multisig/useFetchTxns';
import NoData from '@/components/common/NoData';
import TransactionsLoading from '../loaders/TransactionsLoading';
import DialogTxnFailed from './DialogTxnFailed';

const TXNS_TYPES = [
  { option: 'to-sign', value: 'To be Signed' },
  { option: 'to-broadcast', value: 'To be Broadcasted' },
  { option: 'completed', value: 'Completed' },
  { option: 'failed', value: 'Failed' },
];

const Transactions = ({
  chainID,
  multisigAddress,
  currency,
  threshold,
}: {
  chainID: string;
  multisigAddress: string;
  currency: Currency;
  threshold: number;
}) => {
  const dispatch = useAppDispatch();
  const txnsState = useAppSelector((state) => state.multisig.txns.list);

  const [txnsList, setTxnsList] = useState<Txn[]>([]);
  const [txnsType, setTxnsType] = useState('to-sign');

  const fetchTxns = (status: string) => {
    dispatch(getTxns({ address: multisigAddress, status: status }));
  };

  const txnsCount = useAppSelector((state) => state.multisig.txns.Count)
  const txnsStatus = useAppSelector((state) => state.multisig.txns.status);
  const deleteTxnRes = useAppSelector((state) => state.multisig.deleteTxnRes);
  const signTxStatus = useAppSelector(
    (state) => state.multisig.signTransactionRes
  );
  const updateTxStatus = useAppSelector((state) => state.multisig.updateTxnRes);

  const handleTxnsTypeChange = (type: string) => {
    setTxnsType(type);
    if (['failed', 'history', 'completed'].includes(type)) {
      fetchTxns('history');
    } else {
      fetchTxns('current');
    }
  };

  const isReadyToBroadcast = (txn: Txn) => {
    const signs = txn?.signatures || [];
    if (signs?.length >= threshold) return true;
    else return false;
  };

  const isTxnCompleted = (txn: Txn) => {
    if (txn.status === 'SUCCESS') {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (chainID && multisigAddress) {
      fetchTxns('current');
    }
  }, [chainID, multisigAddress]);

  useEffect(() => {
    let filteredTxns: Txn[] = [];
    if (txnsType === 'to-broadcast') {
      filteredTxns = txnsState.filter((txn) => {
        return isReadyToBroadcast(txn);
      });
    } else if (txnsType === 'to-sign') {
      filteredTxns = txnsState.filter((txn) => {
        return !isReadyToBroadcast(txn);
      });
    } else if (txnsType === 'completed') {
      filteredTxns = txnsState.filter((txn) => {
        return isTxnCompleted(txn);
      });
    } else if (txnsType === 'failed') {
      filteredTxns = txnsState.filter((txn) => {
        return !isTxnCompleted(txn);
      });
    }

    setTxnsList(filteredTxns);
  }, [txnsState]);

  useEffect(() => {
    if (deleteTxnRes.status === TxStatus.IDLE) {
      if (['failed', 'history', 'completed'].includes(txnsType)) {
        fetchTxns('history');
      } else {
        fetchTxns('current');
      }
    }
  }, [deleteTxnRes]);

  useEffect(() => {
    if (
      signTxStatus.status === TxStatus.IDLE ||
      updateTxStatus.status === TxStatus.IDLE ||
      updateTxStatus.status === TxStatus.REJECTED
    ) {
      if (['failed', 'history', 'completed'].includes(txnsType)) {
        fetchTxns('history');
      } else {
        fetchTxns('current');
      }
    }
  }, [signTxStatus.status, updateTxStatus.status]);

  // To reset state after singing or broadcasting txn
  useFetchTxns();

  const createRes = useAppSelector((state) => state.multisig.createTxnRes);

  useEffect(() => {
    if (createRes?.status === 'idle') {
      setTxnsType('to-sign');
      fetchTxns('current');
    }
  }, [createRes]);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <TransactionsFilters
          txnsType={txnsType}
          txnsCount={txnsCount}
          handleTxnsTypeChange={handleTxnsTypeChange}
        />
        {txnsStatus === TxStatus.PENDING ? (
          <TransactionsLoading />
        ) : (
          <div>
            {txnsList?.length ? (
              <TransactionsList
                txns={txnsList}
                currency={currency}
                threshold={threshold}
                multisigAddress={multisigAddress}
                chainID={chainID}
                txnsType={txnsType}
              />
            ) : (
              <NoData height={200} width={232} message="No Transactions" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;

const TransactionsFilters = ({
  handleTxnsTypeChange,
  txnsType,
  txnsCount,
}: {
  txnsType: string;
  handleTxnsTypeChange: (type: string) => void;
   /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  txnsCount: any;
}) => {

  const getCount = (option: string) => {
    let count = 0;
     /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    txnsCount && txnsCount.forEach((t: any) => {
      if (t?.computed_status?.toLowerCase() === option.toLowerCase()) {
        count = t?.count
      }
    })

    return count
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {TXNS_TYPES.map((type) => (
        <TransactionFilterItem
          key={type.option}
          name={`${type.value} (${getCount(type.option)})`}
          isSelected={type.option === txnsType}
          onClick={() => handleTxnsTypeChange(type.option)}
        />
      ))}
    </div>
  );
};

const TransactionFilterItem = ({
  name,
  isSelected,
  onClick,
}: {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={`txns-filter ${isSelected ? 'txns-filter-selected' : 'txns-filter-unselected'}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

const TransactionsList = ({
  txns,
  currency,
  threshold,
  multisigAddress,
  chainID,
  txnsType,
}: {
  txns: Txn[];
  currency: Currency;
  threshold: number;
  multisigAddress: string;
  chainID: string;
  txnsType: string;
}) => {
  const isHistory = ['completed', 'failed'].includes(txnsType);
  const [viewErrorDialogOpen, setViewErrorDialogOpen] =
    useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>('');
  const onViewError = (errMsg: string) => {
    setErrMsg(errMsg);
    setViewErrorDialogOpen(true);
  };
  return (
    <div className="space-y-4">
      {txns.map((txn, index) => (
        <TxnsCard
          key={index}
          txn={txn}
          currency={currency}
          threshold={threshold}
          multisigAddress={multisigAddress}
          chainID={chainID}
          isHistory={isHistory}
          onViewError={onViewError}
          allowRepeat={txnsType === 'completed'}
        />
      ))}
      <DialogTxnFailed
        errMsg={errMsg}
        onClose={() => setViewErrorDialogOpen(false)}
        open={viewErrorDialogOpen}
      />
    </div>
  );
};
