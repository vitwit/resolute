import { DialogContent, Dialog } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';
import { getWalletName } from '@/utils/localStorage';
import { SUPPORTED_WALLETS } from '@/utils/constants';

const WalletPopup = ({
  isOpen,
  onClose,
  selectWallet,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectWallet: (walletName: string) => void;
}) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(
    getWalletName()
  );

  const handleWalletClick = (walletName: string) => {
    setSelectedWallet(walletName);
    selectWallet(walletName);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      className="blur-effect"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="wallet-box">
          <div className="cross w-full" onClick={onClose}>
            <Image
              src="/close-icon.svg"
              width={24}
              height={24}
              alt="Close"
              className="cursor-pointer"
            />
          </div>
          <div className="flex justify-end items-center gap-10 px-10 py-0 w-full">
            <div className="connect-wallet-box space-y-6 w-full">
              <div className="text-white text-xl font-bold ">
                Connect Wallet
              </div>
              <div className="flex space-x-6 justify-center">
                {SUPPORTED_WALLETS.map((wallet) => (
                  <div
                    className={`wallet-grid ${
                      selectedWallet === wallet.name.toLocaleLowerCase()
                        ? 'selected-wallet'
                        : ''
                    }`}
                    onClick={() =>
                      handleWalletClick(wallet.name.toLocaleLowerCase())
                    }
                    key={wallet.name}
                  >
                    <div className="flex space-x-2">
                      <Image
                        src={wallet.logo}
                        width={100}
                        height={100}
                        alt={wallet.name}
                      />
                    </div>
                    <div className="popup-text font-light items-center flex-col">
                      {wallet.name} Wallet
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="cross w-full"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletPopup;
