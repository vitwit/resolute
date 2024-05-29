import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import useGetAccountInfo from '@/custom-hooks/useGetAccountInfo';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';
import {
  getAccountAllMultisigTxns,
  getMultisigAccounts,
  resetCreateMultisigRes,
  setVerifyDialogOpen,
} from '@/store/features/multisig/multisigSlice';
import React, { useEffect, useState } from 'react';
import AllMultisigAccounts from './AllMultisigAccounts';
import RecentTransactions from './RecentTransactions';
import DialogVerifyAccount from '../DialogVerifyAccount';

interface MultisigDashboardI {
  walletAddress: string;
  chainName: string;
  chainID: string;
}

const MultisigDashboard: React.FC<MultisigDashboardI> = (props) => {
  const { walletAddress, chainName, chainID } = props;
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const createMultiAccRes = useAppSelector(
    (state) => state.multisig.createMultisigAccountRes
  );

  const [accountInfo] = useGetAccountInfo(chainID);
  const { pubkey } = accountInfo;
  const { getChainInfo } = useGetChainInfo();
  const { prefix, restURLs, feeCurrencies } = getChainInfo(chainID);
  const { isAccountVerified } = useVerifyAccount({ address: walletAddress });

  useEffect(() => {
    if (walletAddress) {
      dispatch(getMultisigAccounts(walletAddress));
    }
  }, [walletAddress]);

  const handleClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (createMultiAccRes.status === 'idle') {
      setDialogOpen(false);
      dispatch(getMultisigAccounts(walletAddress));
      dispatch(resetCreateMultisigRes());
    }
  }, [createMultiAccRes]);

  const handleCreateMultisig = () => {
    if (isAccountVerified()) {
      setDialogOpen(true);
    } else {
      dispatch(setVerifyDialogOpen(true));
    }
  };

  useEffect(() => {
    if (walletAddress) {
      dispatch(
        getAccountAllMultisigTxns({ address: walletAddress, status: 'current' })
      );
    }
  }, [walletAddress]);

  return (
    <div className="mt-10 space-y-20">
      <AllMultisigAccounts chainName={chainName} />
      <RecentTransactions chainID={chainID} />
      <DialogVerifyAccount walletAddress={walletAddress} />
    </div>
  );
};

export default MultisigDashboard;
