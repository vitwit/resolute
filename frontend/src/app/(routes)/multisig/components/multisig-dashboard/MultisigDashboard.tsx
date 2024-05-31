import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  getAccountAllMultisigTxns,
  getMultisigAccounts,
  resetCreateMultisigRes,
} from '@/store/features/multisig/multisigSlice';
import React, { useEffect } from 'react';
import AllMultisigAccounts from './AllMultisigAccounts';
import RecentTransactions from './RecentTransactions';
import DialogVerifyAccount from '../DialogVerifyAccount';
import { setError } from '@/store/features/common/commonSlice';
import { TxStatus } from '@/types/enums';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';

interface MultisigDashboardI {
  walletAddress: string;
  chainName: string;
  chainID: string;
}

const MultisigDashboard: React.FC<MultisigDashboardI> = (props) => {
  const { walletAddress, chainName, chainID } = props;
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
  const signTxLoading = signTxStatus.status === TxStatus.PENDING;
  const broadcastTxnLoading = broadcastTxnStatus.status === TxStatus.PENDING;

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

  useEffect(() => {
    if (walletAddress) {
      fetchAllTransactions();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (signTxStatus.status === TxStatus.IDLE) {
      dispatch(setError({ type: 'success', message: 'Successfully signed' }));
      fetchAllTransactions();
    } else if (signTxStatus.status === TxStatus.REJECTED) {
      dispatch(
        setError({
          type: 'error',
          message: signTxStatus.error || 'Error while signing the transaction',
        })
      );
      fetchAllTransactions();
    }
  }, [signTxStatus]);

  useEffect(() => {
    if (broadcastTxnStatus.status === TxStatus.IDLE) {
      dispatch(
        setError({ type: 'success', message: 'Broadcasted successfully' })
      );
    } else if (broadcastTxnStatus.status === TxStatus.REJECTED) {
      dispatch(
        setError({
          type: 'error',
          message: broadcastTxnStatus.error || 'Failed to broadcasted',
        })
      );
    }
  }, [broadcastTxnStatus]);

  useEffect(() => {
    if (updateTxStatus.status === TxStatus.IDLE) {
      fetchAllTransactions();
    } else if (updateTxStatus.status === TxStatus.REJECTED) {
      fetchAllTransactions();
    }
  }, [updateTxStatus]);

  return (
    <div className="mt-10 space-y-20">
      <AllMultisigAccounts chainName={chainName} />
      <RecentTransactions chainID={chainID} />
      <DialogVerifyAccount walletAddress={walletAddress} />
      <Dialog
        open={signTxLoading}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: '#ffffff1a',
          },
        }}
        sx={{
          backdropFilter: 'blur(2px)',
        }}
      >
        <DialogContent>
          <div className="flex gap-4 items-center">
            <CircularProgress size={32} sx={{ color: 'white' }} />
            <div className="text-white">
              {' '}
              <span className="italic">Loading...</span>
              <span className="dots-flashing"></span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={broadcastTxnLoading}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: '#ffffff1a',
          },
        }}
        sx={{
          backdropFilter: 'blur(2px)',
        }}
      >
        <DialogContent>
          <div className="flex gap-4 items-center">
            <CircularProgress size={32} sx={{ color: 'white' }} />
            <div className="text-white">
              {' '}
              <span className="italic">Loading...</span>
              <span className="dots-flashing"></span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultisigDashboard;
