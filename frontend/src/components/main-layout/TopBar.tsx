import Image from 'next/image';
import React from 'react';

const walletUserName = 'Test User';
const connectWalletLogo = 'wallet-logos/keplr-logo-small.svg';

const TopBar = () => {
  return (
    <header className="top-bar">
      <nav>
        <div>
          <Image
            src="/resolute-logo.png"
            width={120}
            height={32}
            alt="Resolute"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Image
              src={connectWalletLogo}
              height={24}
              width={24}
              alt="Wallet"
            />
            <div className="text-[18px] text-white">{walletUserName}</div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default TopBar;
