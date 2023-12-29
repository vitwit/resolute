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
import {
  establishWalletConnection,
  unsetIsLoading,
} from '../store/features/wallet/walletSlice';
import { RootState } from '../store/store';
import { getAllTokensPrice } from '@/store/features/common/commonSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import WalletPopup from './WalletPopup';
import CustomParticles from './Particles';
import Loading from './Loading';

export const Landingpage = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const connected = useAppSelector(
    (state: RootState) => state.wallet.connected
  );
  const isLoading = useAppSelector((state) => state.wallet.isLoading);
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
    } else {
      dispatch(unsetIsLoading());
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

  if (isLoading) {
    return <Loading />;
  }

  return connected ? (
    <>{children}</>
  ) : (
    <div>
      <div className="absolute">
        <CustomParticles />
      </div>

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
                      Resolute is an advanced spacecraft designed to travel
                      through the multiverse, connecting Cosmos sovereign
                      chains.
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
              className="absolute right-[800px] top-[400px] image-animation"
              src="/agoric-logo.png"
              width={59}
              height={59}
              alt="landing page image"
            />
            <Image
              className="absolute right-[900px] top-[190px] image-animation"
              src="/akash-logo.png"
              width={95}
              height={95}
              alt="landing page image"
            />
            <Image
              className="absolute right-[800px] top-[600px] image-animation"
              src="/tgrade-logo.png"
              width={59}
              height={59}
              alt="landing page image"
            />
            <Image
              className="absolute right-[900px] top-[700px] image-animation"
              src="/logo5.png"
              width={62}
              height={62}
              alt="landing page image"
            />
            <Image
              className="absolute right-[200px] top-[100px] image-animation"
              src="/desmos-logo.png"
              width={75}
              height={75}
              alt="landing page image"
            />
            <Image
              className="absolute right-[400px] top-[250px] image-animation"
              src="/evmos-logo.png"
              width={96}
              height={96}
              alt="landing page image"
            />
            <Image
              className="absolute right-[100px] top-[200px] image-animation"
              src="/osmosis-logo.png"
              width={96}
              height={96}
              alt="landing page image"
            />
            <Image
              className="absolute right-[300px] top-[400px] image-animation"
              src="/stargaze-logo.png"
              width={59}
              height={59}
              alt="landing page image"
            />
            <Image
              className="absolute right-[450px] top-[500px] image-animation"
              src="/regen-logo.png"
              width={63}
              height={63}
              alt="landing page image"
            />
            <Image
              className="absolute right-[250px] top-[600px] image-animation"
              src="/dydx-logo.png"
              width={106}
              height={106}
              alt="landing page image"
            />
            <Image
              className="absolute right-[50px] top-[500px] image-animation"
              src="/cosmos-logo.png"
              width={94}
              height={94}
              alt="landing page image"
            />
            <Image
              className="absolute right-[100px] top-[700px] image-animation"
              src="/juno-logo.png"
              width={93}
              height={93}
              alt="landing page image"
            />
            <Image
              className="absolute right-[550px] top-[750px] image-animation"
              src="/passage-logo.png"
              width={97}
              height={97}
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
