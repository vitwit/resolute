'use client';
import React, { useEffect, useState } from 'react';
import { networks } from '../utils/chainsInfo';
import Image from 'next/image';
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
import WalletPopup from './WalletPopup';
import CustomParticles from './Particles';

export const Landingpage = ({ children }: { children: React.ReactNode }) => {
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
      <CustomParticles />
      
      <div className="landingpage-background">
        <div className="flex flex-col min-h-screen w-full flex-1 justify-between fixed z-50">
          <div>
            <div className="flex justify-center items-center h-8 w-full "></div>

            <Image
              className="ml-20"
              src="/vitwit-logo-main.png"
              width={180}
              height={47.5}
              alt="Vitwit-Logo"
            />
          </div>
          <div className="flex items-center  pl-20 py-0 h-full">
            <div className="">
              <div className="flex flex-col space-y-6">
                <div className="flex text-white text-center text-[100px] not-italic font-extrabold leading-[100px] tracking-[7px]">
                  Resolute
                </div>
                <div className="flex flex-col space-y-10">
                  <div className="flex flex-col space-y-2 w-[512px]">
                    <div className="text-white text-[28px] font-light">
                      Interchain Interface
                    </div>
                    <div className="text-white text-lg font-thin leading-normal">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididun.
                    </div>
                  </div>
                  <div
                    className="landingpage-button"
                    onClick={() => setConnectWalletDialogOpen(true)}
                  >
                    <p className="text-white text-lg font-bold">
                      Connect Wallet
                    </p>
                  </div>
                </div>
              </div>

              <WalletPopup
                isOpen={connectWalletDialogOpen}
                onClose={handleClose}
                selectWallet={selectWallet}
              />
            </div>

            <Image
              className="ml-auto"
              src="/laptop.svg"
              width={967}
              height={581}
              alt="landing page image"
            />
          </div>

          <div>
            <div className="flex justify-center items-center  h-10"></div>
            <div className="powered-by-background">
              <div className="powered-by text">Powered by Vitwit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
