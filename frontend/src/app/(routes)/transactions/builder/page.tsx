'use client';
import EmptyScreen from '@/components/common/EmptyScreen';
import PageHeader from '@/components/common/PageHeader';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setChangeNetworkDialogOpen } from '@/store/features/common/commonSlice';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import { TXN_BUILDER_DESCRIPTION } from '@/utils/constants';
import React from 'react';

const Page = () => {
  const dispatch = useAppDispatch();
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const openChangeNetwork = () => {
    dispatch(setChangeNetworkDialogOpen({ open: true, showSearch: true }));
  };
  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  return (
    <div className="py-10 h-full flex flex-col">
      <PageHeader
        title="Transaction Builder"
        description={TXN_BUILDER_DESCRIPTION}
      />
      <div>
        <div className="flex-1 flex items-center justify-center mt-16">
          {isWalletConnected ? (
            <EmptyScreen
              title="Please select a network"
              description="All networks page is not supported for multisig, Please select a network."
              hasActionBtn={true}
              btnText={'Select Network'}
              btnOnClick={openChangeNetwork}
            />
          ) : (
            <EmptyScreen
              title="Connect your wallet"
              description="Connect your wallet to access your account on Resolute"
              hasActionBtn={true}
              btnText={'Connect Wallet'}
              btnOnClick={connectWalletOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
