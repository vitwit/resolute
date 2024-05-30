import React, { useEffect, useState } from 'react';
import AllMultisigs from './AllMultisigs';
import MultisigSidebar from './MultisigSidebar';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { RootState } from '@/store/store';
import {
  getMultisigAccounts,
  resetDeleteMultisigRes,
} from '@/store/features/multisig/multisigSlice';
import { resetError } from '@/store/features/common/commonSlice';
import DialogVerifyAccount from './DialogVerifyAccount';
import PageHeader from '@/components/common/PageHeader';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import EmptyScreen from '@/components/common/EmptyScreen';
import MultisigDashboard from './multisig-dashboard/MultisigDashboard';
import CustomButton from '@/components/common/CustomButton';
import DialogCreateMultisig from './DialogCreateMultisig';

const PageMultisig = ({ chainName }: { chainName: string }) => {
  const dispatch = useAppDispatch();
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const nameToChainIDs = useAppSelector(
    (state: RootState) => state.wallet.nameToChainIDs
  );
  const chainID = nameToChainIDs[chainName];

  const { getChainInfo } = useGetChainInfo();
  const { address: walletAddress } = getChainInfo(chainID);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  useEffect(() => {
    dispatch(resetError());
    dispatch(resetDeleteMultisigRes());
  }, []);

  useEffect(() => {
    if (walletAddress) dispatch(getMultisigAccounts(walletAddress));
  }, []);

  const toggleCreateDialog = () => {
    setCreateDialogOpen((prev) => !prev);
  };

  return (
    <div className="py-20 px-10 h-full flex flex-col">
      <div className="flex items-center gap-10 w-full">
        <div className="flex-1">
          <PageHeader
            title="MultiSig"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, fugit."
          />
        </div>
        {isWalletConnected ? (
          <CustomButton
            btnOnClick={toggleCreateDialog}
            btnText="Create Multisig"
            btnStyles="w-fit"
          />
        ) : null}
      </div>
      <div>
        {!isWalletConnected ? (
          <div className="flex-1 flex items-center justify-center">
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
          />
        )}
      </div>
      {isWalletConnected ? (
        <DialogCreateMultisig
          open={createDialogOpen}
          onClose={toggleCreateDialog}
          chainID={chainID}
        />
      ) : null}
    </div>
  );
};

export default PageMultisig;
