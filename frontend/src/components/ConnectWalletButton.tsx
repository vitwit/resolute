"use client";
import React, { useState } from "react";
import { connectWalletV1 } from "../services/walletService";
import { networks } from "../utils/chainsInfo";
import Image from "next/image";
import Walletpage from "./popups/WalletPage";
import { isConnected } from "staking/utils/localStorage";

export const ConnectWalletButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connected, setConnected] = useState(isConnected());
  const [connectWalletDialogOpen, setConnectWalletDialogOpen] =
    useState<boolean>(false);
  const handleClose = () => {
    setConnectWalletDialogOpen(!connectWalletDialogOpen);
  };
  const selectWallet = (walletName: string) => {
    connectWalletV1({
      mainnets: networks,
      testnets: [],
      walletName: walletName,
      setConnected,
    });
  };
  return connected ? (
    <>{children}</>
  ) : (
    <div>
      <div className="connect-wallet">
        <Image
          className="space-ship-image-1"
          src="/space-ship.png"
          width={136}
          height={151}
          alt="Space Ship"
        />
        <Image
          className="space-ship-image-2"
          src="/space-ship.png"
          width={72}
          height={80}
          alt="Space Ship"
        />
        <div className="connect-wallet-header">
          <Image
            src="/vitwit-logo.png"
            width={184}
            height={51}
            alt="Vitwit-Logo"
          />
        </div>
        <div className="home-title">
          <h1>Res</h1>
          <Image src="/o.png" width={348} height={200} alt="Resolute" />
          <h1>lute</h1>
        </div>
        <div className="home-title-caption">
          <h2>Interchain Interface</h2>
        </div>
        <div>
          <button
            className="connect-wallet-btn"
            onClick={() => {
              setConnectWalletDialogOpen(true);
            }}
          >
            CONNECT WALLET
          </button>
        </div>
      </div>
      <Walletpage
        open={connectWalletDialogOpen}
        handleClose={handleClose}
        selectWallet={selectWallet}
      />
    </div>
  );
};
