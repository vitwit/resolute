import CustomButton from '@/components/common/CustomButton';
import SectionHeader from '@/components/common/SectionHeader';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { getTxns } from '@/store/features/multisig/multisigSlice';
import { Txn } from '@/types/multisig';
import { isMultisigMember } from '@/utils/util';
import React, { useEffect, useRef, useState } from 'react';
import TxnMsg from '../msgs/TxnMsg';
import BroadCastTxn from '../BroadCastTxn';
import SignTxn from '../SignTxn';
import Image from 'next/image';
import {
  DROP_DOWN_CLOSE,
  DROP_DOWN_OPEN,
  MENU_ICON,
} from '@/constants/image-names';
import { TxStatus } from '@/types/enums';
import CustomLoader from '@/components/common/CustomLoader';

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

  const txnsStatus = useAppSelector((state) => state.multisig.txns.status);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1">
          <SectionHeader title="Transactions" description="All transactions" />
        </div>
        <CustomButton btnText="Create Transaction" btnStyles="w-fit" />
      </div>
      <div className="space-y-6">
        <TransactionsFilters
          txnsType={txnsType}
          handleTxnsTypeChange={handleTxnsTypeChange}
        />
        {txnsStatus === TxStatus.PENDING ? (
          <div className="h-40 flex justify-center items-center">
            <CustomLoader />
          </div>
        ) : (
          <TransactionsList
            txns={txnsList}
            currency={currency}
            threshold={threshold}
            multisigAddress={multisigAddress}
            chainID={chainID}
          />
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
}: {
  txns: Txn[];
  currency: Currency;
  threshold: number;
  multisigAddress: string;
  chainID: string;
}) => {
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
        />
      ))}
    </div>
  );
};

const TxnsCard = ({
  txn,
  currency,
  threshold,
  multisigAddress,
  chainID,
}: {
  txn: Txn;
  currency: Currency;
  threshold: number;
  multisigAddress: string;
  chainID: string;
}) => {
  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress } = getChainInfo(chainID);
  const [showAll, setShowAll] = useState(false);
  const { messages } = txn;
  const pubKeys = txn.pubkeys || [];
  const isMember = isMultisigMember(pubKeys, walletAddress);
  const isReadyToBroadcast = () => {
    const signs = txn?.signatures || [];
    if (signs?.length >= threshold) return true;
    else return false;
  };

  const [optionsOpen, setOptionsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuRef2.current &&
        !menuRef2.current.contains(event.target as Node)
      ) {
        setOptionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="txn-card relative">
      <div className="space-y-2 w-[40%]">
        <div className="text-small-light">Transaction Messages</div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="text-b1">#1</div>
              <TxnMsg msg={messages[0]} currency={currency} />
            </div>
            {messages?.length > 1 ? (
              <ExpandViewButton
                showAll={showAll}
                toggleView={() => setShowAll((prev) => !prev)}
              />
            ) : null}
          </div>
          {showAll
            ? messages.slice(1, messages?.length).map((msg, index) => (
                <div key={index}>
                  <div className="flex gap-2">
                    <div className="font-bold">{`#${index + 2}`}</div>
                    <TxnMsg msg={msg} currency={currency} />
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
      <div className="space-y-2 w-1/6">
        <div className="text-small-light">Signed</div>
        <div className="flex gap-[2px] items-end">
          <span className="text-b1">{txn.signatures.length}</span>
          <span className="text-small-light">/</span>
          <span className="text-small-light">{pubKeys.length}</span>
        </div>
      </div>
      <div className="w-1/6">
        <div className="flex items-center gap-6">
          {isReadyToBroadcast() ? (
            <BroadCastTxn
              txn={txn}
              multisigAddress={multisigAddress}
              pubKeys={txn.pubkeys || []}
              threshold={threshold}
              chainID={chainID}
              isMember={isMember}
            />
          ) : (
            <SignTxn
              address={multisigAddress}
              chainID={chainID}
              isMember={isMember}
              txId={txn.id}
              unSignedTxn={txn}
            />
          )}
          <div
            ref={menuRef2}
            onMouseEnter={() => setOptionsOpen(true)}
            onMouseLeave={() => setOptionsOpen(false)}
            className="cursor-pointer"
          >
            <Image src={MENU_ICON} height={24} width={24} alt="Menu" />
          </div>
        </div>
      </div>
      {optionsOpen ? (
        <MoreOptions
          setOptionsOpen={(value: boolean) => setOptionsOpen(value)}
        />
      ) : null}
    </div>
  );
};

const ExpandViewButton = ({
  showAll,
  toggleView,
}: {
  showAll: boolean;
  toggleView: () => void;
}) => {
  return (
    <Image
      className="cursor-pointer"
      onClick={() => toggleView()}
      src={showAll ? DROP_DOWN_CLOSE : DROP_DOWN_OPEN}
      width={16}
      height={16}
      alt=""
    />
  );
};

const MoreOptions = ({
  setOptionsOpen,
}: {
  setOptionsOpen: (value: boolean) => void;
}) => {
  return (
    <div
      className="more-options"
      onMouseEnter={() => setOptionsOpen(true)}
      onMouseLeave={() => setOptionsOpen(false)}
    >
      <div className={`hover:bg-[#FFFFFF14] cursor-pointer p-4 text-b1`}>
        Delete
      </div>
      <div className={`hover:bg-[#FFFFFF14] cursor-pointer p-4 text-b1`}>
        View Raw
      </div>
    </div>
  );
};
