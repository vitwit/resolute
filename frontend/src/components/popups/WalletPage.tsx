import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@mui/material';
import { supportedWallets } from '@/utils/contants';
import { dialogBoxPaperPropStyles } from '@/utils/commonStyles';

const Walletpage = ({
  open,
  handleClose,
  selectWallet,
}: {
  open: boolean;
  handleClose: () => void;
  selectWallet: (walletName: string) => void;
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      className="blur-effect"
      PaperProps={{
        sx: dialogBoxPaperPropStyles,
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="custom-box flex-col">
          <div className="add-wallet-header">
            <h2>Add Wallet</h2>
            <div className="dialog-close-icon" onClick={handleClose}>
              <Image src="/close.svg" width={40} height={40} alt="close" />
            </div>
          </div>
          <div className="add-wallet-dialog-content">
            {supportedWallets.map((wallet, index) => (
              <div
                className="wallet"
                onClick={() => {
                  selectWallet(wallet.name.toLocaleLowerCase());
                }}
                key={index}
              >
                <Image
                  src={wallet.logo}
                  width={100}
                  height={100}
                  alt={wallet.name}
                />
                <p className="wallet-name">{wallet.name}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Walletpage;
