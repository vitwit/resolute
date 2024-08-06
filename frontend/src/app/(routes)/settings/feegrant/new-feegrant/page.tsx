'use client';

import React from 'react';
import '../../settings.css';
import NewFeegrantPage from './components/NewFeegrantPage';
import Link from 'next/link';
import PageHeader from '@/components/common/PageHeader';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import EmptyScreen from '@/components/common/EmptyScreen';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';

const PageCreateFeegrant = () => {
  const dispatch = useAppDispatch();
  const isWalletConnected = useAppSelector((state) => state.wallet.connected);

  const connectWallet = () => {
    dispatch(setConnectWalletOpen(true));
  };
  return (
    <div className="feegrant-main">
      <div className="">
        <Link
          href="/settings/feegrant"
          className="text-btn h-8 flex items-center w-fit"
        >
          <span>Back</span>
        </Link>
        <PageHeader title="New Feegrant" description="New Feegrant" />
      </div>
      {isWalletConnected ? (
        <NewFeegrantPage />
      ) : (
        <div className="mt-20">
          <EmptyScreen
            title="Connect your wallet"
            description="Connect your wallet to access your account on Resolute"
            hasActionBtn={true}
            btnText={'Connect Wallet'}
            btnOnClick={connectWallet}
          />
        </div>
      )}
    </div>
  );
};

export default PageCreateFeegrant;
