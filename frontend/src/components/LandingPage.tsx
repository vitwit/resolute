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
declare let window: WalletWindow;

import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { CosmjsOfflineSigner, experimentalSuggestChain,  connectSnap, getSnap } from '@leapwallet/cosmos-snap-provider';

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

  const tryConnectWallet = async (walletName: string) => {
    if (walletName === 'metamask') {
      try {
        for (let i = 0; i < networks.length; i++) {
          const chainId: string = networks[i].config.chainId;
          const snapInstalled = await getSnap();
          if (!snapInstalled) {
            await connectSnap(); // Initiates installation if not already present
          }

          await experimentalSuggestChain(networks[i].config, {force: false})

          const offlineSigner = new CosmjsOfflineSigner(chainId);
          const accounts = await offlineSigner.getAccounts();
          console.log('accounts', accounts)
          const rpcUrl = networks[i].config.rpc; // Populate with an RPC URL corresponding to the given chainId

          const stargateClient = await SigningCosmWasmClient.connectWithSigner(
            rpcUrl,
            offlineSigner
          );

          console.log('stargate client', stargateClient)
        }
      } catch (error) {
        console.log('trying to connect wallet ', error)
      }
    }

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
      <div className="landingpage-container">
        <CustomParticles />
      </div>

      <div className="landingpage-background">
        <div className="flex flex-col min-h-screen w-full flex-1 justify-between fixed z-50">
          <div>
            <div className="flex justify-center items-center h-8 w-full "></div>

            <Image
              className="ml-4 sm:ml-20"
              src="/vitwit-logo-main.png"
              width={180}
              height={47.5}
              alt="Vitwit-Logo"
            />
          </div>
          <div className="flex items-center  pl-20 py-0 h-full">
            <div className="">
              <div className="flex flex-col space-y-6">
                <div className="flex text-white text-center sm:text-[100px] not-italic font-extrabold leading-[100px] tracking-[7px]">
                  Resolute
                </div>
                <div className="flex flex-col space-y-10">
                  <div className="flex flex-col space-y-2 sm:w-[512px]">
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
                isSwitchWallet={false}
              />
            </div>

            <Image
              className="ml-auto  sm:w-[600] md:w-[800] lg:w-[967]"
              src="/landing-laptop.svg"
              width={967}
              height={481}
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
