import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  getAccountAllMultisigTxns,
  getMultisigAccounts,
  resetBroadcastTxnRes,
  resetCreateMultisigRes,
  resetCreateTxnState,
  resetsignTransactionRes,
  resetSignTxnState,
  resetUpdateTxnState,
} from '@/store/features/multisig/multisigSlice';
import React, { useEffect } from 'react';
import AllMultisigAccounts from './AllMultisigAccounts';
import RecentTransactions from './RecentTransactions';
import { setError } from '@/store/features/common/commonSlice';
import { TxStatus } from '@/types/enums';
import Loader from '../common/Loader';
import DialogVerifyAccount from '../common/DialogVerifyAccount';

interface MultisigDashboardI {
  walletAddress: string;
  chainName: string;
  chainID: string;
  setCreateDialogOpen: () => void;
}

const MultisigDashboard: React.FC<MultisigDashboardI> = (props) => {
  const { walletAddress, chainName, chainID, setCreateDialogOpen } = props;
  const dispatch = useAppDispatch();

  const createMultiAccRes = useAppSelector(
    (state) => state.multisig.createMultisigAccountRes
  );

  const signTxStatus = useAppSelector(
    (state) => state.multisig.signTransactionRes
  );
  const broadcastTxnStatus = useAppSelector(
    (state) => state.multisig.broadcastTxnRes
  );
  const updateTxStatus = useAppSelector((state) => state.multisig.updateTxnRes);
  const deleteTxnRes = useAppSelector((state) => state.multisig.deleteTxnRes);

  useEffect(() => {
    if (walletAddress) {
      dispatch(getMultisigAccounts(walletAddress));
    }
  }, [walletAddress]);

  useEffect(() => {
    if (createMultiAccRes.status === 'idle') {
      dispatch(getMultisigAccounts(walletAddress));
      dispatch(resetCreateMultisigRes());
    }
  }, [createMultiAccRes]);

  const fetchAllTransactions = () => {
    dispatch(
      getAccountAllMultisigTxns({ address: walletAddress, status: 'current' })
    );
  };

  const resetSignTxn = () => {
    dispatch(resetSignTxnState());
    dispatch(resetsignTransactionRes());
  };

  const resetBroadcastTxn = () => {
    dispatch(resetUpdateTxnState());
    dispatch(resetBroadcastTxnRes());
  };

  useEffect(() => {
    if (walletAddress) {
      fetchAllTransactions();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (signTxStatus.status === TxStatus.IDLE) {
      dispatch(setError({ type: 'success', message: 'Successfully signed' }));
      resetSignTxn();
      fetchAllTransactions();
    } else if (signTxStatus.status === TxStatus.REJECTED) {
      dispatch(
        setError({
          type: 'error',
          message: signTxStatus.error || 'Error while signing the transaction',
        })
      );
      resetSignTxn();
      fetchAllTransactions();
    }
  }, [signTxStatus]);

  useEffect(() => {
    if (broadcastTxnStatus.status === TxStatus.IDLE) {
      dispatch(
        setError({ type: 'success', message: 'Broadcasted successfully' })
      );
      resetBroadcastTxn();
    } else if (broadcastTxnStatus.status === TxStatus.REJECTED) {
      dispatch(
        setError({
          type: 'error',
          message: broadcastTxnStatus.error || 'Failed to broadcasted',
        })
      );
      resetBroadcastTxn();
    }
  }, [broadcastTxnStatus]);

  useEffect(() => {
    if (updateTxStatus.status === TxStatus.IDLE) {
      fetchAllTransactions();
    } else if (updateTxStatus.status === TxStatus.REJECTED) {
      fetchAllTransactions();
    }
  }, [updateTxStatus]);

  useEffect(() => {
    if (deleteTxnRes.status === TxStatus.IDLE) {
      fetchAllTransactions();
    }
  }, [deleteTxnRes]);

  useEffect(() => {
    dispatch(resetCreateTxnState());
    dispatch(resetUpdateTxnState());
    dispatch(resetBroadcastTxnRes());
    dispatch(resetsignTransactionRes());
  }, []);

  return (
    <div className="mt-10 space-y-10">
      <RecentTransactions chainID={chainID} />
      <AllMultisigAccounts
        chainName={chainName}
        setCreateDialogOpen={setCreateDialogOpen}
      />
      <DialogVerifyAccount walletAddress={walletAddress} />
      <Loader />
    </div>
  );
};

export default MultisigDashboard;
