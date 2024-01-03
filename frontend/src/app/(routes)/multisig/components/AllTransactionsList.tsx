import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { MultisigAddressPubkey, Txn, Txns } from '@/types/multisig';
import { EMPTY_TXN } from '@/utils/constants';
import React, { useEffect, useMemo, useState } from 'react';
import DialogViewRaw from './DialogViewRaw';
import DialogTxnFailed from './DialogTxnFailed';
import DialogViewTxnMessages from './DialogViewTxnMessages';
import TransactionCard from './TransactionCard';
import { isMultisigMember } from '@/utils/util';
import Image from 'next/image';
import { TxStatus } from '@/types/enums';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import { CircularProgress } from '@mui/material';

interface AllTransactionsListProps {
  chainID: string;
  txnsState: Txns;
  isHistory: boolean;
}

const AllTransactionsList: React.FC<AllTransactionsListProps> = (props) => {
  const { chainID, txnsState, isHistory } = props;

  const [msgDialogOpen, setMsgDialogOpen] = useState<boolean>(false);
  const [viewRawOpen, setViewRawDialogOpen] = useState<boolean>(false);
  const [viewErrorOpen, setViewErrorDialogOpen] = useState<boolean>(false);

  const createSignRes = useAppSelector(
    (state: RootState) => state.multisig.signTxRes
  );
  const updateTxnState = useAppSelector(
    (state: RootState) => state.multisig.updateTxnRes
  );
  const toggleMsgDialogOpen = () => {
    setMsgDialogOpen((prevState) => !prevState);
  };
  const txnsLoading = useAppSelector(
    (state: RootState) => state.multisig?.txns?.status
  );
  const toggleViewRawDialogOpen = () => {
    setViewRawDialogOpen((prevState) => !prevState);
  };
  const handleMsgDialogClose = () => {
    setMsgDialogOpen(false);
  };

  const [selectedTxn, setSelectedTxn] = useState<Txn>(EMPTY_TXN);
  const [errMsg, setErrMsg] = useState('');
  const [pubKeys, setPubKeys] = useState<MultisigAddressPubkey[]>([]);
  const [multisigAddress, setMultisigAddress] = useState<string>('');
  const [threshold, setThreshold] = useState<number>(0);

  const onViewMoreAction = (txn: Txn) => {
    const { pubkeys = [], multisig_address = '', threshold = 0 } = txn;
    setSelectedTxn(txn);
    setMsgDialogOpen(true);
    setPubKeys(pubkeys);
    setMultisigAddress(multisig_address);
    setThreshold(threshold);
  };

  const onViewRawAction = (txn: Txn) => {
    setSelectedTxn(txn);
    setViewRawDialogOpen(true);
  };

  const onViewError = (errMsg: string) => {
    setErrMsg(errMsg);
    setViewErrorDialogOpen(true);
  };

  const { getDenomInfo, getChainInfo } = useGetChainInfo();
  const { explorerTxHashEndpoint, address: walletAddress } =
    getChainInfo(chainID);
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = useMemo(
    () => ({
      coinMinimalDenom: minimalDenom,
      coinDecimals: decimals,
      coinDenom: displayDenom,
    }),
    [minimalDenom, decimals, displayDenom]
  );

  useEffect(() => {
    if (createSignRes.status !== TxStatus.PENDING) {
      setMsgDialogOpen(false);
    }
  }, [createSignRes.status]);

  useEffect(() => {
    if (updateTxnState.status === TxStatus.IDLE) {
      setMsgDialogOpen(false);
    }
  }, [updateTxnState.status]);

  return (
    <div className="pb-6 space-y-6 text-[14px] flex flex-col justify-between">
      {txnsState.list.map((txn) => {
        const mAddress = txn.multisig_address;
        const pKeys = txn.pubkeys || [];
        const threshold_value = txn.threshold || 0;
        const isMember = isMultisigMember(pKeys, walletAddress);

        return (
          <TransactionCard
            key={txn.id}
            isMember={isMember}
            txn={txn}
            multisigAddress={mAddress}
            threshold={threshold_value}
            membersCount={pKeys.length}
            chainID={chainID}
            isHistory={isHistory}
            onViewMoreAction={onViewMoreAction}
            currency={currency}
            onViewRawAction={onViewRawAction}
            onViewError={onViewError}
            explorerTxHashEndpoint={explorerTxHashEndpoint}
          />
        );
      })}
      <div className="mt-[50%] flex flex-col justify-center items-center">
        {txnsLoading !== TxStatus.PENDING && !txnsState.list.length ? (
          <div>
            <Image
              src="/no-transactions.png"
              width={200}
              height={130}
              alt={'No Transactions'}
              draggable={false}
            />
            <div className="empty-screen-text">No Transactions</div>
          </div>
        ) : null}
        {txnsLoading === TxStatus.PENDING ? (
          <CircularProgress size={24} sx={{ color: 'white' }} />
        ) : null}
      </div>

      <DialogViewTxnMessages
        open={msgDialogOpen}
        txn={selectedTxn}
        multisigAddress={multisigAddress}
        threshold={threshold}
        pubKeys={pubKeys}
        membersCount={pubKeys.length}
        chainID={chainID}
        isHistory={isHistory}
        toggleMsgDialogOpen={toggleMsgDialogOpen}
        currency={currency}
        onViewRawAction={onViewRawAction}
        explorerTxHashEndpoint={explorerTxHashEndpoint}
        onViewError={onViewError}
        handleMsgDialogClose={handleMsgDialogClose}
      />
      <DialogViewRaw
        open={viewRawOpen}
        onClose={toggleViewRawDialogOpen}
        txn={selectedTxn}
      />
      <DialogTxnFailed
        open={viewErrorOpen}
        onClose={() => setViewErrorDialogOpen(false)}
        errMsg={errMsg}
      />
    </div>
  );
};

export default AllTransactionsList;
