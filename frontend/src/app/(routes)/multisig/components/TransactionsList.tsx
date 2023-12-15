import { useAppSelector } from '@/custom-hooks/StateHooks';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { RootState } from '@/store/store';
import { Txn, Txns } from '@/types/multisig';
import { EMPTY_TXN } from '@/utils/constants';
import React, { useMemo, useState } from 'react';
import DialogViewRaw from './DialogViewRaw';
import DialogTxnFailed from './DialogTxnFailed';
import DialogViewTxnMessages from './DialogViewTxnMessages';
import TransactionCard from './TransactionCard';

interface TransactionsListProps {
  chainID: string;
  isMember: boolean;
  txnsState: Txns;
  isHistory: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = (props) => {
  const { chainID, isMember, txnsState, isHistory } = props;
  const multisigAccount = useAppSelector(
    (state: RootState) => state.multisig.multisigAccount
  );
  const members = multisigAccount.pubkeys || [];
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

  const onViewMoreAction = (txn: Txn) => {
    setSelectedTxn(txn);
    setMsgDialogOpen(true);
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
      {txnsState.list.map((txn) => (
        <TransactionCard
          key={txn.id}
          isMember={isMember}
          txn={txn}
          multisigAccount={multisigAccount}
          membersCount={members.length}
          chainID={chainID}
          isHistory={isHistory}
          onViewMoreAction={onViewMoreAction}
          currency={currency}
          onViewRawAction={onViewRawAction}
          onViewError={onViewError}
          explorerTxHashEndpoint={explorerTxHashEndpoint}
        />
      ))}
      {!txnsState.list.length ? (
        <div className="mt-16 text-[14px] text-center">- No Transactions -</div>
      ) : null}
      <DialogViewTxnMessages
        open={msgDialogOpen}
        isMember={isMember}
        txn={selectedTxn}
        multisigAccount={multisigAccount}
        membersCount={members.length}
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

export default TransactionsList;
