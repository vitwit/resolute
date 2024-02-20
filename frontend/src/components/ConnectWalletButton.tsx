import React, { useState } from 'react';
import { networks } from '../utils/chainsInfo';
import {
  connectSnap,
  experimentalSuggestChain,
  getSnap,
} from '@leapwallet/cosmos-snap-provider';
import { establishWalletConnection } from '@/store/features/wallet/walletSlice';
import { getLocalNetworks } from '@/utils/localStorage';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import WalletPopup from './WalletPopup';

const ConnectWalletButton = () => {
  const dispatch = useAppDispatch();
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

  return (
    <div className="flex items-center">
      <button
        onClick={() => setConnectWalletDialogOpen(true)}
        className="primary-gradient px-3 py-[6px] text-[12px] leading-[20px] rounded-lg font-medium"
      >
        Connect Wallet
      </button>
      <WalletPopup
        isOpen={connectWalletDialogOpen}
        onClose={handleClose}
        selectWallet={selectWallet}
      />
    </div>
  );
};

export default ConnectWalletButton;
