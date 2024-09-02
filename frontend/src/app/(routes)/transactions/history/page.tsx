'use client';
import EmptyScreen from '@/components/common/EmptyScreen';
import PageHeader from '@/components/common/PageHeader';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import React from 'react';
import SearchTransaction from './SearchTransaction';

const Page = () => {
  const dispatch = useAppDispatch();
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  return (
    <div className="py-10 h-full flex flex-col">
      <PageHeader
        title="Transaction History"
        description={'Your transaction history'}
      />
      <div className="flex-1 flex items-center justify-center mt-16 w-full">
        {isWalletConnected ? (
          <SearchTransaction />
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
  );
};

export default Page;
