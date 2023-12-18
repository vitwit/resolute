import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { MultisigAddressPubkey, Txn, Txns } from '@/types/multisig';
import { EMPTY_TXN } from '@/utils/constants';
import React, { useMemo, useState } from 'react';
import DialogViewRaw from './DialogViewRaw';
import DialogTxnFailed from './DialogTxnFailed';
import DialogViewTxnMessages from './DialogViewTxnMessages';
import TransactionCard from './TransactionCard';

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

  const toggleMsgDialogOpen = () => {
    setMsgDialogOpen((prevState) => !prevState);
  };

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
    setSelectedTxn(txn);
    setMsgDialogOpen(true);
    setPubKeys(txn.pubkeys || []);
    setMultisigAddress(txn.multisig_address);
    setThreshold(txn.threshold || 0);
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
  const { explorerTxHashEndpoint } = getChainInfo(chainID);
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = useMemo(
    () => ({
      coinMinimalDenom: minimalDenom,
      coinDecimals: decimals,
      coinDenom: displayDenom,
    }),
    [minimalDenom, decimals, displayDenom]
  );

  return (
    <div className="pb-6 space-y-6 text-[14px] flex flex-col justify-between">
      {/* TODO: extract pubkeys, memberscount, address from txn  */}
      {txnsState.list.map((txn) => {
        const isMember = true;
        const mAddress = txn.multisig_address;
        const pKeys = txn.pubkeys || [];
        const threshold_value = txn.threshold || 0;

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
      {!txnsState.list.length ? (
        <div className="mt-16 text-[14px] text-center">- No Transactions -</div>
      ) : null}
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
