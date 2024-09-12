'use client';

import React from 'react';
import '../../settings.css';
import PageHeader from '@/components/common/PageHeader';
import { GENERAL_SETTINGS_DESCRIPTION } from '@/utils/constants';
import EmptyScreen from '@/components/common/EmptyScreen';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setChangeNetworkDialogOpen } from '@/store/features/common/commonSlice';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';

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
      <PageHeader title="Settings" description={GENERAL_SETTINGS_DESCRIPTION} />
      <div>
        <div className="flex-1 flex items-center justify-center mt-16">
          {isWalletConnected ? (
            <EmptyScreen
              title="Please select all networks"
              description="Please select all networks to view access general settings."
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
