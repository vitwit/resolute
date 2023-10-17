"use client";
import React, { useState } from "react";
import { connectWalletV1 } from "../services/walletService";
import { networks } from "../utils/chainsInfo";
import Image from "next/image";

export const ConnectWalletButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConnected, setIsConnected] = useState(false);

  return isConnected ? (
    <>{children}</>
  ) : (
    <div>
      <div className="connectWallet">
        <Image
          className="connectWallet__ship1"
          src="/space-ship.png"
          width={136}
          height={151}
          alt="Space Ship"
        />
        <Image
          className="connectWallet__ship2"
          src="/space-ship.png"
          width={72}
          height={80}
          alt="Space Ship"
        />
        <div className="connectWallet__header">
          <Image
            src="/vitwit-logo.png"
            width={184}
            height={51}
            alt="Vitwit-Logo"
          />
        </div>
        <div className="resolute__title">
          <h1>Res</h1>
          <Image src="/o.png" width={348} height={200} alt="Resolute" />
          <h1>lute</h1>
        </div>
        <div className="resolute__title__caption">
          <h2>Interchain Interface</h2>
        </div>
        <div>
          <button
            className="connectWallet__btn"
            onClick={() => {
              connectWalletV1({
                mainnets: networks,
                testnets: [],
                setIsConnected,
              });
            }}
          >
            CONNECT WALLET
          </button>
        </div>
      </div>
    </div>
  );
};
