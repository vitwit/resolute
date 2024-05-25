'use client';
import React, { useEffect } from 'react';
import { networks } from '../utils/chainsInfo';
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
import { setAllNetworksInfo } from '@/store/features/common/commonSlice';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
declare let window: WalletWindow;

import {
  experimentalSuggestChain,
  connectSnap,
  getSnap,
} from '@leapwallet/cosmos-snap-provider';

export const Landingpage = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((state) => state.wallet.isLoading);

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

  const tryConnectWallet = async (walletName: string) => {
    if (walletName === 'metamask') {
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
    return (
      <div className="h-screen w-screen bg-gray-600 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return <div>{children}</div>;
};
