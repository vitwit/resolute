import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ProfileDialog from './ProfileDialog';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setConnectWalletOpen } from '@/store/features/wallet/walletSlice';
import { getConnectWalletLogo } from '@/utils/util';

const TopBar = () => {
  const dispatch = useAppDispatch();
  const [profileOpen, setProfileOpen] = useState(false);
  const walletConnected = useAppSelector((state) => state.wallet.connected);
  const walletUserName = useAppSelector((state) => state.wallet.name);
  const [walletLogo, setWalletLogo] = useState('');

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
      <nav>
        <div>
          <Image
            src="/resolute-logo.png"
            width={120}
            height={32}
            alt="Resolute"
          />
        </div>
        <div className="flex justify-end gap-6">
          <div className="flex gap-4 items-center">
            <a
              href="https://t.me/yourtelegramchannel"
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
              href="https://t.me/yourtelegramchannel"
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
            <a
              href="https://t.me/yourtelegramchannel"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="text-b1">Join our community</p>
            </a>
          </div>
          {walletConnected ? null : (
            <div className="flex-1 flex justify-center  mr-[120px]">
              <div className="flex items-center gap-6">
                <div className="secondary-text">
                  Connect your wallet now to access your account on Resolute
                </div>
                <button onClick={connectWalletOpen} className="primary-btn">
                  Connect Wallet
                </button>
              </div>
            </div>
          )}
          {walletConnected ? (
            <div
              className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#FFFFFF0A] rounded-full"
              onClick={() => setProfileOpen(true)}
            >
              <Image src={walletLogo} height={20} width={20} alt="Wallet" />
              <div className="text-[14px]">{walletUserName}</div>
              <Image src="/drop-down-icon.svg" height={24} width={24} alt="" />
            </div>
          ) : null}
        </div>
      </nav>
      <ProfileDialog onClose={onClose} open={profileOpen} />
    </header>
  );
};

export default TopBar;
