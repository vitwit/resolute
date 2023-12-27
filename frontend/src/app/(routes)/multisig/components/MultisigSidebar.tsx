import TopNav from '@/components/TopNav';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import {
  getAccountAllMultisigTxns,
  getTxns,
} from '@/store/features/multisig/multisigSlice';
import React, { useEffect, useState } from 'react';
import TransactionsList from './TransactionsList';
import { RootState } from '@/store/store';
import DialogCreateTxn from './DialogCreateTxn';
import { setError } from '@/store/features/common/commonSlice';
import { TxStatus } from '@/types/enums';
import AllTransactionsList from './AllTransactionsList';

interface MultisigSidebarProps {
  chainID: string;
  accountSpecific: boolean;
  address?: string;
  walletAddress: string;
  verified: boolean;
}

const MultisigSidebar: React.FC<MultisigSidebarProps> = (props) => {
  const { chainID, accountSpecific, address, walletAddress, verified } = props;
  const dispatch = useAppDispatch();
  const [isHistory, setIsHistory] = useState<boolean>(false);
  const [isMember, setIsMember] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const multisigAccount = useAppSelector(
    (state: RootState) => state.multisig.multisigAccount
  );
  const txnsState = useAppSelector((state: RootState) => state.multisig.txns);

  const updateTxnStatus = useAppSelector(
    (state: RootState) => state.multisig.updateTxnRes
  );
  const createSignRes = useAppSelector(
    (state: RootState) => state.multisig.signTxRes
  );
  const createTxnRes = useAppSelector(
    (state: RootState) => state.multisig.createTxnRes
  );
  const deleteTxnRes = useAppSelector(
    (state: RootState) => state.multisig.deleteTxnRes
  );

  const { pubkeys } = multisigAccount;

  const getAllTxs = (status: string) => {
    if (accountSpecific) {
      if (address) {
        dispatch(
          getTxns({
            address: address,
            status: status,
          })
        );
      }
    } else {
      dispatch(getAccountAllMultisigTxns({ address: walletAddress, status }));
    }
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  useEffect(() => {
    getAllTxs(isHistory ? 'history' : 'current');
  }, [isHistory]);

  useEffect(() => {
    const result = pubkeys?.filter((keys) => {
      return keys.address === walletAddress;
    });
    if (result?.length) {
      setIsMember(true);
    }
  }, [pubkeys]);

  useEffect(() => {
    if (updateTxnStatus.status === 'idle') {
      getAllTxs(isHistory ? 'history' : 'current');
    }
  }, [updateTxnStatus]);

  useEffect(() => {
    if (createSignRes.status === TxStatus.IDLE) {
      dispatch(setError({ type: 'success', message: 'Successfully signed' }));
      getAllTxs(isHistory ? 'history' : 'current');
    } else if (createSignRes.status === TxStatus.REJECTED) {
      dispatch(
        setError({
          type: 'error',
          message: 'Error while signing the transaction',
        })
      );
    }
  }, [createSignRes]);

  useEffect(() => {
    if (createTxnRes.status === TxStatus.IDLE) {
      dispatch(
        setError({
          type: 'success',
          message: 'Transaction created successfully',
        })
      );
      setIsHistory(false);
      getAllTxs('current');
    } else if (createTxnRes.status === TxStatus.REJECTED) {
      dispatch(
        setError({
          type: 'error',
          message: 'Error while creating the transaction',
        })
      );
    }
  }, [createTxnRes]);

  useEffect(() => {
    if (deleteTxnRes.status === TxStatus.IDLE) {
      dispatch(
        setError({
          type: 'success',
          message: 'Transaction deleted successfully',
        })
      );
      getAllTxs(isHistory ? 'history' : 'current');
    } else if (deleteTxnRes.status === TxStatus.REJECTED) {
      dispatch(
        setError({
          type: 'error',
          message: 'Error while deleting the transaction',
        })
      );
    }
  }, [deleteTxnRes]);

  return (
    <div className="multisig-sidebar">
      <TopNav />
      {verified ? (
        <>
          <div className="space-y-4">
            <div className="flex justify-between items-center h-9">
              <div className="text-[16px] leading-normal">Transactions</div>
              {accountSpecific ? (
                <div>
                  <button
                    className="create-multisig-btn"
                    disabled={!isMember}
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    Create Transaction
                  </button>
                </div>
              ) : null}
            </div>
            <div className="mt-4 py-2 flex flex-col">
              <div className="flex gap-6 text-white">
                <div
                  className="custom-radio-button-label"
                  onClick={() => setIsHistory(false)}
                >
                  <div className="custom-radio-button">
                    {!isHistory ? (
                      <div className="custom-radio-button-checked"></div>
                    ) : null}
                  </div>
                  <div>Active Transactions</div>
                </div>
                <div
                  className="custom-radio-button-label"
                  onClick={() => setIsHistory(true)}
                >
                  <div className="custom-radio-button">
                    {isHistory ? (
                      <div className="custom-radio-button-checked"></div>
                    ) : null}
                  </div>
                  <div>Completed Transactions</div>
                </div>
              </div>
            </div>
          </div>

          {accountSpecific ? (
            <>
              <TransactionsList
                chainID={chainID}
                isMember={isMember}
                txnsState={txnsState}
                isHistory={isHistory}
              />
              <DialogCreateTxn
                open={createDialogOpen}
                onClose={handleCreateDialogClose}
                chainID={chainID}
                address={address || ''}
                walletAddress={walletAddress}
              />
            </>
          ) : (
            <>
              <AllTransactionsList
                chainID={chainID}
                txnsState={txnsState}
                isHistory={isHistory}
              />
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default MultisigSidebar;
