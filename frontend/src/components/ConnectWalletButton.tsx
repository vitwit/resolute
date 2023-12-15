'use client';
import React, { useEffect, useState } from 'react';
import { networks } from '../utils/chainsInfo';
import Image from 'next/image';
import Walletpage from './popups/WalletPage';
import {
  getLocalNetworks,
  getWalletName,
  isConnected,
  removeAllAuthTokens,
} from '../utils/localStorage';
import { establishWalletConnection } from '../store/features/wallet/walletSlice';
import { RootState } from '../store/store';
import { getAllTokensPrice } from '@/store/features/common/commonSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';

export const ConnectWalletButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const connected = useAppSelector(
    (state: RootState) => state.wallet.connected
  );
  const [connectWalletDialogOpen, setConnectWalletDialogOpen] =
    useState<boolean>(false);
  const handleClose = () => {
    setConnectWalletDialogOpen(
      (connectWalletDialogOpen) => !connectWalletDialogOpen
    );
  };

  const selectWallet = (walletName: string) => {
    tryConnectWallet(walletName);
    handleClose();
  };

  const tryConnectWallet = (walletName: string) => {
    dispatch(
      establishWalletConnection({
        walletName,
        networks: [...networks, ...getLocalNetworks()],
      })
    );
  };

  useEffect(() => {
    const walletName = getWalletName();
    if (isConnected()) {
      tryConnectWallet(walletName);
    }

    const accountChangeListener = () => {
      setTimeout(() => tryConnectWallet(walletName), 1000);
      removeAllAuthTokens();
      window.location.reload();
    };

    window.addEventListener(
      `${walletName}_keystorechange`,
      accountChangeListener
    );

    dispatch(getAllTokensPrice());

    return () => {
      window.removeEventListener(
        `${walletName}_keystorechange`,
        accountChangeListener
      );
    };
  }, []);

  return connected ? (
    <>{children}</>
  ) : (
    <div>
      <div className="connect-wallet">
        <Image
          className="space-ship-image-1"
          src="/space-ship.png"
          width={136}
          height={151}
          alt="Space Ship"
        />
        <Image
          className="space-ship-image-2"
          src="/space-ship.png"
          width={72}
          height={80}
          alt="Space Ship"
        />
        <div className="connect-wallet-header">
          <Image
            src="/vitwit-logo.png"
            width={184}
            height={51}
            alt="Vitwit-Logo"
          />
        </div>
        <div className="home-title">
          <h1>Res</h1>
          <Image src="/o.png" width={348} height={200} alt="Resolute" />
          <h1>lute</h1>
        </div>
        <div className="home-title-caption">
          <h2>Interchain Interface</h2>
        </div>
        <div>
          <button
            className="connect-wallet-btn"
            onClick={() => {
              setConnectWalletDialogOpen(true);
            }}
          >
            CONNECT WALLET
          </button>
        </div>
      </div>
      <Walletpage
        open={connectWalletDialogOpen}
        handleClose={handleClose}
        selectWallet={selectWallet}
      />
    </div>
  );
};
