import CustomButton from '@/components/common/CustomButton';
import SectionHeader from '@/components/common/SectionHeader';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  getTxns,
  setVerifyDialogOpen,
} from '@/store/features/multisig/multisigSlice';
import { Txn } from '@/types/multisig';
import React, { useEffect, useState } from 'react';
import { TxStatus } from '@/types/enums';
import TxnsCard from '../common/TxnsCard';
import { useRouter } from 'next/navigation';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import useFetchTxns from '@/custom-hooks/multisig/useFetchTxns';
import NoData from '@/components/common/NoData';
import TransactionsLoading from '../loaders/TransactionsLoading';

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
  chainName,
  walletAddress,
}: {
  chainID: string;
  multisigAddress: string;
  currency: Currency;
  threshold: number;
  chainName: string;
  walletAddress: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAccountVerified } = useVerifyAccount({
    address: walletAddress,
  });
  const txnsState = useAppSelector((state) => state.multisig.txns.list);

  const [txnsList, setTxnsList] = useState<Txn[]>([]);
  const [txnsType, setTxnsType] = useState('to-sign');

  const fetchTxns = (status: string) => {
    dispatch(getTxns({ address: multisigAddress, status: status }));
  };

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

  const onCreateNewTxn = () => {
    if (!isAccountVerified()) {
      dispatch(setVerifyDialogOpen(true));
      return;
    }
    router.push(`/multisig/${chainName}/${multisigAddress}/create-txn`);
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

  // To refetch txns after singing or broadcasting txn
  useFetchTxns();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1">
          <SectionHeader title="Transactions" description="All transactions" />
        </div>
        <CustomButton
          btnText="Create Transaction"
          btnStyles="w-fit"
          btnOnClick={onCreateNewTxn}
        />
      </div>
      <div className="space-y-6">
        <TransactionsFilters
          txnsType={txnsType}
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
}: {
  txnsType: string;
  handleTxnsTypeChange: (type: string) => void;
}) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {TXNS_TYPES.map((type) => (
        <TransactionFilterItem
          key={type.option}
          name={type.value}
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
        />
      ))}
    </div>
  );
};
