'use client';
import React, { useEffect, useState } from 'react';
import { networks } from '../utils/chainsInfo';
import Image from 'next/image';
import {
  getLocalNetworks,
  getWalletName,
  isConnected,
} from '../utils/localStorage';
import { establishWalletConnection } from '../store/features/wallet/walletSlice';
import { RootState } from '../store/store';
import { getAllTokensPrice } from '@/store/features/common/commonSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import WalletPopup from './WalletPopup';

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
      <div className="landingpage-background">
        <div className="flex justify-center items-center gap-2.5 p-2.5 w-full h-8"></div>

        <div className="pl-20">
          <Image
            src="/vitwit-logo-main.png"
            width={180}
            height={475}
            alt="Vitwit-Logo"
          />
        </div>
        <div className="flex items-center gap-10 pl-20 py-0 ">
          <div className="space-y-40">
            <div className="flex flex-col space-y-6">
              <div className="flex text-white text-center text-[100px] not-italic font-extrabold leading-[100px] tracking-[7px]">
                Resolute
              </div>
              <div className="flex flex-col space-y-10">
                <div className="flex flex-col space-y-2 w-[512px]">
                  <div className="text-white text-[28px] font-light">
                    Interface Interchain
                  </div>
                  <div className="text-white text-lg font-thin leading-normal">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididun.
                  </div>
                </div>
                <div
                  className="flex w-[220px] justify-center items-center gap-6 px-10 py-6 rounded-[100px] border-2 border-solid border-[#4AA29C] cursor-pointer"
                  onClick={() => setConnectWalletDialogOpen(true)}
                >
                  <p className="text-white text-lg font-bold">Connect Wallet</p>
                </div>
              </div>
            </div>

            <WalletPopup
              isOpen={connectWalletDialogOpen}
              onClose={handleClose}
              selectWallet={selectWallet}
            />
          </div>

          <div className="absolute left-[521px] top-[38px]">
            <Image
              src="/background-circle.png"
              width={402}
              height={456}
              alt="background-circle"
            />
          </div>
          <div className="flex justify-end w-full">
            <div className="flex absolute  mt-20">
              <video width={812} height={800} controls loop muted autoPlay>
                <source src="/video.mp4" type="video/mp4" />
              </video>
            </div>
            <Image
              src="/landingpage.png"
              width={975}
              height={500}
              alt="landing page image"
            />
          </div>
        </div>

        <div className="powered-by-background">
          <div className="powered-by text">Powered by VitWit</div>
        </div>
      </div>
    </div>
  );
};
