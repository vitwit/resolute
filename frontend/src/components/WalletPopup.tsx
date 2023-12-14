import { DialogContent, Dialog } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import { supportedWallets } from '@/utils/contants';

const WalletPopup = ({
  isOpen,
  onClose,
  selectWallet,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectWallet: (walletName: string) => void;
}) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleWalletClick = (walletName: string) => {
    setSelectedWallet(walletName);
    selectWallet(walletName); // Pass the walletName directly
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      className="blur-effect"
      PaperProps={{ sx: { borderRadius: '16px', backgroundColor: '#20172F' } }}
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
          <div className="flex justify-end items-center gap-10 px-10 py-0">
            <div>
              <Image
                src="/blocks.png"
                width={272}
                height={222}
                alt="Block-structure"
              />
            </div>
            <div className="connect-wallet-box">
              <div className="text-white text-xl font-bold">Connect Wallet</div>
              <div className="flex space-x-6">
                {supportedWallets.map((wallet) => (
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
                        width={32}
                        height={32}
                        alt={wallet.name}
                      />
                      <div className="popup-text font-light items-center flex">
                        {wallet.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* TODO: Re-enable this button in the future when the connect feature is implemented
              <div>
                <button className="button">
                  <p className="popup-text">Connect</p>
                </button>
              </div> */}
            </div>
          </div>
          <div className="cross w-full"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletPopup;
