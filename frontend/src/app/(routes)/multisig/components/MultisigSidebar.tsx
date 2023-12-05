import TopNav from '@/components/TopNav';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { getTxns } from '@/store/features/multisig/multisigSlice';
import React, { useEffect, useState } from 'react';
import TransactionsList from './TransactionsList';
import { RootState } from '@/store/store';

interface MultisigSidebarProps {
  accountSpecific: boolean;
  address?: string;
  walletAddress: string;
}

const MultisigSidebar = ({
  accountSpecific,
  address,
  walletAddress,
}: MultisigSidebarProps) => {
  const dispatch = useAppDispatch();
  const [isHistory, setIsHistory] = useState<boolean>(false);
  const [isMember, setIsMember] = useState(false);
  const multisigAccount = useAppSelector(
    (state: RootState) => state.multisig.multisigAccount
  );
  const txnsState = useAppSelector((state: RootState) => state.multisig.txns);

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
    }
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

  return (
    <div className="multisig-sidebar">
      <TopNav />
      <div className="space-y-4">
        {accountSpecific ? (
          <div className="flex justify-between h-9">
            <div className="text-[16px] leading-normal">Transactions</div>
            <div>
              <button className="create-multisig-btn">
                Create Transaction
              </button>
            </div>
          </div>
        ) : null}
        <div className="mt-4 py-2">
          <div className="flex gap-6 text-white">
            <div
              className="custom-radio-button-label"
              onClick={() => setIsHistory(false)}
            >
              <div className="custom-ratio-button">
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
              <div className="custom-ratio-button">
                {isHistory ? (
                  <div className="custom-radio-button-checked"></div>
                ) : null}
              </div>
              <div>Completed Transactions</div>
            </div>
          </div>
        </div>
      </div>
      <TransactionsList isMember={isMember} txnsState={txnsState} />
    </div>
  );
};

export default MultisigSidebar;
