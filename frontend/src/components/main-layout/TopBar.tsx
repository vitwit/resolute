import Image from 'next/image';
import React from 'react';

const walletUserName = 'Test User';
const connectWalletLogo = 'wallet-logos/keplr-logo-small.svg';

const TopBar = () => {
  return (
    <header className="bg-[#151517] flex justify-center items-center min-h-[60px] fixed top-0 left-0 right-0">
      <nav className="px-10 w-full max-w-[1512px] flex justify-between items-center">
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
          <Image
            src="icons/notification-icon.svg"
            width={24}
            height={24}
            alt="Notifications"
          />
        </div>
      </nav>
    </header>
  );
};

export default TopBar;
