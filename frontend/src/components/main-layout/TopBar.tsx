import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ProfileDialog from './ProfileDialog';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import { getConnectWalletLogo } from '@/utils/util';
import { RESOLUTE_LOGO } from '@/constants/image-names';
import { RootState } from '@/store/store';

const TopBar = () => {
  const dispatch = useAppDispatch();
  const [profileOpen, setProfileOpen] = useState(false);
  const [walletLogo, setWalletLogo] = useState('');

  const {
    name: walletUserName,
    connected: walletConnected,
    isLoading: isWalletLoading,
  } = useAppSelector((state: RootState) => state.wallet);

  const onClose = () => {
    setProfileOpen(false);
  };

  const connectWalletOpen = () => {
    dispatch(setConnectWalletOpen(true));
  };

  useEffect(() => {
    setWalletLogo(getConnectWalletLogo());
  }, [walletConnected]);

  return (
    <header className="top-bar">
      <nav className="flex justify-between items-center px-4 py-2">
        <div>
          <Link href="/" passHref>
            <Image src={RESOLUTE_LOGO} width={120} height={32} alt="Resolute" />
          </Link>
        </div>
        <div className="flex-1 flex justify-center items-center">
          {isWalletLoading
            ? null
            : !walletConnected && (
                <div className="flex items-center gap-6">
                  <div className="secondary-text text-center">
                    Connect your wallet now to access your account on Resolute
                  </div>
                  <button onClick={connectWalletOpen} className="primary-btn">
                    Connect Wallet
                  </button>
                </div>
              )}
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://t.me/+3bXmS6GE4HRjYmU1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/telegram-icon.png"
              width={20}
              height={20}
              alt="telegram"
            />
          </a>
          <a
            href="https://twitter.com/vitwit_"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/twitter-icon.png"
              width={20}
              height={20}
              alt="twitter"
            />
          </a>

          {walletConnected && (
            <div
              className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#FFFFFF0A] rounded-full"
              onClick={() => setProfileOpen(true)}
            >
              <Image src={walletLogo} height={20} width={20} alt="Wallet" />
              <div className="text-[14px]">{walletUserName}</div>
              <Image
                src="/drop-down-icon.svg"
                height={24}
                width={24}
                alt=""
                className="opacity-60"
              />
            </div>
          )}
        </div>
      </nav>
      <ProfileDialog onClose={onClose} open={profileOpen} />
    </header>
  );
};

export default TopBar;
