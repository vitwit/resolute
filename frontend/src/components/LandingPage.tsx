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
import { setAllNetworksInfo } from '@/store/features/common/commonSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import WalletPopup from './WalletPopup';
import CustomParticles from './Particles';
import Loading from './Loading';
declare let window: WalletWindow;

import {
  experimentalSuggestChain,
  connectSnap,
  getSnap,
} from '@leapwallet/cosmos-snap-provider';
import { CircularProgress } from '@mui/material';
import { usePathname } from 'next/navigation';

export const Landingpage = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const connected = useAppSelector(
    (state: RootState) => state.wallet.connected
  );

  const walletLoading = useAppSelector(
    (state: RootState) => state.wallet.isLoading
  )

  useEffect(() => {
    if (!walletLoading) {
      setLoad(false);
    }
  }, [walletLoading])

  const isLoading = useAppSelector((state) => state.wallet.isLoading);
  const [connectWalletDialogOpen, setConnectWalletDialogOpen] =
    useState<boolean>(false);
  const handleClose = () => {
    setConnectWalletDialogOpen(
      (connectWalletDialogOpen) => !connectWalletDialogOpen
    );
  };

  const [load, setLoad] = useState<boolean>(false);

  useEffect(() => {
    setLoad(false);
  }, [connected]);

  // window.ethereum.on('networkChanged', function (networkId: any) {
  //   // Time to reload your interface with the new networkId
  //   console.log(networkId)
  // })

  // window.ethereum.on('accountsChanged', function (accounts: any) {
  //   // Time to reload your interface with accounts[0]!
  //   console.log('accounts==', accounts)
  //   const walletName = getWalletName();
  //   if (isConnected()) {
  //     tryConnectWallet(walletName);
  //   } else {
  //     dispatch(unsetIsLoading());
  //   }
  // })

  const selectWallet = (walletName: string) => {
    tryConnectWallet(walletName);
    handleClose();
  };

  const tryConnectWallet = async (walletName: string) => {
    if (walletName === 'metamask') {
      setLoad(true);
      try {
        for (let i = 0; i < networks.length; i++) {
          const chainId: string = networks[i].config.chainId;
          const snapInstalled = await getSnap();
          if (!snapInstalled) {
            await connectSnap(); // Initiates installation if not already present
          }

          try {
            await experimentalSuggestChain(networks[i].config, {
              force: false,
            });
          } catch (error) {
            console.log('Error while connecting ', chainId);
          }
        }
      } catch (error) {
        console.log('trying to connect wallet ', error);
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
    dispatch(setAllNetworksInfo());

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

  return connected || pathName.includes('/validator') ? (
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
                  {walletLoading || load ? (
                    <div className="landingpage-button">
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    </div>
                  ) : (
                    <div
                      className="landingpage-button"
                      onClick={() => setConnectWalletDialogOpen(true)}
                    >
                      <p className="text-white text-lg font-bold">
                        Connect Wallet
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <WalletPopup
                isOpen={connectWalletDialogOpen}
                onClose={handleClose}
                selectWallet={selectWallet}
              />
            </div>

            <Image
              className="ml-auto  sm:w-[600] md:w-[800] lg:w-[967]"
              src="https://resolute.sgp1.cdn.digitaloceanspaces.com/landing-laptop.svg"
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
