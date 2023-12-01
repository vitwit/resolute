import { DialogContent, Dialog } from '@mui/material';
import Image from 'next/image';
import React from 'react';
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
              src="./close-icon.svg"
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
                {supportedWallets.map((wallet, index) => (
                  <div
                    className="wallet-grid"
                    onClick={() => {
                      selectWallet(wallet.name.toLocaleLowerCase());
                    }}
                    key={index}
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
              <div>
                <button className="button">
                  <p className="popup-text">Connect</p>
                </button>
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
