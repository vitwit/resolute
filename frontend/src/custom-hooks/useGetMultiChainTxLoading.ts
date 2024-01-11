import { useState } from 'react';
import { useAppDispatch } from './StateHooks';
import { txCreateAuthzGrant } from '@/store/features/authz/authzSlice';

const useMultiTxTracker = () => {
  const dispatch = useAppDispatch();
  // tracker : Map<ChainID, Status + anything> & count: pending txns count
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [ChainsStatus, setChainsStatus] = useState<Record<string, string>>({});
  const [currentTxCount, setCurrentTxCount] = useState(0);
  const reset = () => {
    setChainsStatus({});
    setCurrentTxCount(0);
  };
  const updateChainStatus = (
    chainID: string,
    isTxSuccess: boolean,
    txInputs?: any,
    error?: string
  ) => {
    setChainsStatus((chainsStatus) => {
      chainsStatus[chainID] = isTxSuccess
        ? 'Transaction Success'
        : error || 'Failed';
      return chainsStatus;
    });
    setCurrentTxCount((count) => count - 1);
    if (currentTxCount === 1) {
      reset();
    }
  };
  const trackTxs = (chains: MultiChainTx[]) => {
    reset();
    setCurrentTxCount(chains.length);
    chains.forEach((chain) => {
      /* Track started */
      setChainsStatus((chainsStatus) => {
        chainsStatus[chain.ChainID] =
          'Transaction Pending or (any data to show)';
        return chainsStatus;
      });

      /* the below curried callback can use txInputs(chain.txInputs) of this context in case needed
       this will be called inside the redux slice after tx is done (full-filled or rejected) */
      const onTxComplete = (isTxSuccess: boolean, error?: string) => {
        updateChainStatus(chain.ChainID, isTxSuccess, chain.txInputs, error);
      };
      chain.txInputs.onTxComplete = onTxComplete;
      /* dispatch the tx along with the above callBack*/
      dispatch(txCreateAuthzGrant(chain.txInputs));
    });
  };
  /*
  trackTxns is a method to dispatch and track txns
  chainSStatus to check for txns status
  currentTxCount to check for how many txns are completed
   */
  return { trackTxs, ChainsStatus, currentTxCount };
};
export default useMultiTxTracker;
