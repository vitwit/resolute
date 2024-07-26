import React, { useEffect, useState } from 'react';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getMultisigAccounts,
  resetCreateMultisigRes,
  resetDeleteMultisigRes,
  setVerifyDialogOpen,
} from '@/store/features/multisig/multisigSlice';
import { resetError } from '@/store/features/common/commonSlice';
import PageHeader from '@/components/common/PageHeader';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import EmptyScreen from '@/components/common/EmptyScreen';
import MultisigDashboard from './multisig-dashboard/MultisigDashboard';
import CustomButton from '@/components/common/CustomButton';
import DialogCreateMultisig from './create-multisig/DialogCreateMultisig';
import useVerifyAccount from '@/custom-hooks/useVerifyAccount';

const PageMultisig = ({ chainName }: { chainName: string }) => {
  const dispatch = useAppDispatch();
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const createMultiAccRes = useAppSelector(
    (state: RootState) => state.multisig.createMultisigAccountRes
  );
  const multisigAccounts = useAppSelector(
    (state) => state.multisig.multisigAccounts
  );
  const accounts = multisigAccounts.accounts;
  const chainID = nameToChainIDs[chainName];

  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress } = getChainInfo(chainID);
  const { isAccountVerified } = useVerifyAccount({
    address: walletAddress,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  useEffect(() => {
    dispatch(resetError());
    dispatch(resetDeleteMultisigRes());
  }, []);

  const openCreateDialog = () => {
    if (isAccountVerified()) {
      setCreateDialogOpen(true);
    } else {
      dispatch(setVerifyDialogOpen(true));
    }
  };

  const closeCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  useEffect(() => {
    if (createMultiAccRes.status === 'idle') {
      setCreateDialogOpen(false);
      dispatch(getMultisigAccounts(walletAddress));
      dispatch(resetCreateMultisigRes());
    }
  }, [createMultiAccRes]);

  return (
    <div className="py-10 h-full flex flex-col min-h-[100vh]">
      <div className="flex items-end w-full">
        <div className="flex-1">
          <PageHeader
            title="MultiSig"
            description="You can create and manage all your multisig accounts here"
          />
        </div>
        {isWalletConnected && accounts?.length ? (
          <CustomButton
            btnOnClick={openCreateDialog}
            btnText="Create Multisig"
            btnStyles="w-fit"
          />
        ) : null}
      </div>
      <div>
        {!isWalletConnected ? (
          <div className="flex-1 flex items-center justify-center mt-16">
            <EmptyScreen
              title="Connect your wallet"
              description="Connect your wallet to access your account on Resolute"
              hasActionBtn={true}
              btnText={'Connect Wallet'}
              btnOnClick={connectWalletOpen}
            />
          </div>
        ) : (
          <MultisigDashboard
            chainID={chainID}
            chainName={chainName}
            walletAddress={walletAddress}
            setCreateDialogOpen={openCreateDialog}
          />
        )}
      </div>
      {isWalletConnected ? (
        <DialogCreateMultisig
          open={createDialogOpen}
          onClose={closeCreateDialog}
          chainID={chainID}
        />
      ) : null}
    </div>
  );
};

export default PageMultisig;
