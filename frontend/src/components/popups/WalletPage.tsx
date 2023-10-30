import React from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@mui/material";

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
      PaperProps={{ sx: { borderRadius: "16px", backgroundColor: "#20172F" } }}
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
            <div
              className="wallet"
              onClick={() => {
                selectWallet("keplr");
              }}
            >
              <Image
                src="/Keplrwallet.png"
                width={100}
                height={100}
                alt="Keplrwallet"
              />
              <p className="wallet-name">Keplr Wallet</p>
            </div>
            <div
              className="wallet"
              onClick={() => {
                selectWallet("leap");
              }}
            >
              <Image
                src="/Leapwallet.png"
                width={100}
                height={100}
                alt="Leap Wallet"
              />
              <p className="wallet-name">Leap Wallet</p>
            </div>
            <div
              className="wallet"
              onClick={() => {
                selectWallet("cosmostation");
              }}
            >
              <Image
                src="/cosmostation.png"
                width={100}
                height={100}
                alt="cosmostation"
              />
              <p className="wallet-name">Cosmostation </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Walletpage;
