'use client';

import React, { useEffect } from 'react';
import TopBar from './TopBar';
import SideBar from './SideBar';
import '@/app/fixed-layout.css';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { networks } from '@/utils/chainsInfo';
import {
  connectSnap,
  experimentalSuggestChain,
  getSnap,
} from '@leapwallet/cosmos-snap-provider';
import {
  establishWalletConnection,
  unsetIsLoading,
} from '@/store/features/wallet/walletSlice';
import {
  getLocalNetworks,
  getWalletName,
  isConnected,
  removeAllAuthTokens,
} from '@/utils/localStorage';
import { setAllNetworksInfo } from '@/store/features/common/commonSlice';
import useShortCuts from '@/custom-hooks/useShortCuts';
import TransactionStatusPopup from '../txn-status-popups/TransactionStatusPopup';
import IBCSwapTxStatus from '../IBCSwapTxStatus';
import useFetchPriceInfo from '@/custom-hooks/useFetchPriceInfo';
import Footer from '../common/Footer';

const FixedLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  useShortCuts();

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

  useFetchPriceInfo();

  return (
    <div className="fixed-layout">
      <TopBar />
      <main className="main">
        <div className="main-container">
          <SideBar />
          <section className="dynamic-section">
            <section className='px-10'>{children}</section>
            <footer>
              <Footer />
            </footer>
          </section>
        </div>
      </main>
      <TransactionStatusPopup />
      <IBCSwapTxStatus />
    </div>
  );
};

export default FixedLayout;
