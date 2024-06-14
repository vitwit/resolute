import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../StateHooks';
import { TxStatus } from '@/types/enums';
import { setError } from '@/store/features/common/commonSlice';
import {
  resetBroadcastTxnRes,
  resetsignTransactionRes,
  resetSignTxnState,
  resetUpdateTxnState,
} from '@/store/features/multisig/multisigSlice';

// To refetch txns after singing or broadcasting txn
const useFetchTxns = () => {
  const dispatch = useAppDispatch();
  const signTxStatus = useAppSelector(
    (state) => state.multisig.signTransactionRes
  );
  const broadcastTxnStatus = useAppSelector(
    (state) => state.multisig.broadcastTxnRes
  );

  const resetSignTxn = () => {
    dispatch(resetSignTxnState());
    dispatch(resetsignTransactionRes());
  };

  const resetBroadcastTxn = () => {
    dispatch(resetUpdateTxnState());
    dispatch(resetBroadcastTxnRes());
  };

  useEffect(() => {
    if (signTxStatus.status === TxStatus.IDLE) {
      dispatch(setError({ type: 'success', message: 'Successfully signed' }));
      resetSignTxn();
    } else if (signTxStatus.status === TxStatus.REJECTED) {
      dispatch(
        setError({
          type: 'error',
          message: signTxStatus.error || 'Error while signing the transaction',
        })
      );
      resetSignTxn();
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
};

export default useFetchTxns;
