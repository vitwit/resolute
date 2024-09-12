'use client';

import React, { useEffect } from 'react';
import TopBar from './TopBar';
import SideBar from './SideBar';
import '@/app/fixed-layout.css';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { networks } from '@/utils/chainsInfo';
import {
  connectSnap,
  experimentalSuggestChain,
  getSnap,
} from '@leapwallet/cosmos-snap-provider';
import {
  establishWalletConnection,
  setIsLoading,
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
import Footer from '../common/Footer';
import DynamicSection from './DynamicSection';
import useInitApp from '@/custom-hooks/common/useInitApp';
import CustomLoader from '../common/CustomLoader';
import { TxStatus } from '@/types/enums';

const FixedLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  useShortCuts();
  const showAuthzAlert = useAppSelector(
    (state) => state.authz.authzAlert.display
  );
  const isLoading = useAppSelector((state) => state.wallet.isLoading);

  const walletState = useAppSelector((state) => state.wallet.status);

  const tryConnectWallet = async (walletName: string) => {
    if (walletName === 'metamask') {
      // dispatch(setIsLoading());
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

  // Initialize the application state
  useInitApp();

  return (
    <div className="fixed-layout">
      <TopBar />
      <main className="main">
        <div className="main-container">
          <SideBar />
          <section
            className={`dynamic-section ${showAuthzAlert ? 'mt-[114px]' : 'mt-[60px]'}`}
          >
            <section
              className={`px-10 ${showAuthzAlert ? 'min-h-[calc(100vh-110px)]' : 'min-h-[calc(100vh-56px)]'}`}
            >
              {walletState === TxStatus.PENDING || isLoading ? (
                <div className="w-full mx-auto my-[20%] opacity-60">
                  <CustomLoader
                    loadingText="Fetching wallet details"
                    textStyles="italic text-[#fffffff0]"
                  />
                </div>
              ) : (
                <DynamicSection>{children}</DynamicSection>
              )}
            </section>
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
