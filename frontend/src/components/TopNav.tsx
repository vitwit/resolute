import Profile from '@/app/(routes)/(overview)/overview-components/Profile';
import React from 'react';
import SelectNetwork from './SelectNetwork';
import AuthzButton from './AuthzButton';
import FeegrantButton from './FeegrantButton';
import { useAppSelector } from '@/custom-hooks/StateHooks';
import ConnectWalletButton from './ConnectWalletButton';

const TopNav = ({
  message,
  showAuthzButton,
  showFeegrantButton,
}: {
  message?: string;
  showAuthzButton?: boolean;
  showFeegrantButton?: boolean;
}) => {
  const connected = useAppSelector((state) => state.wallet.connected);
  return (
    <div className="flex justify-between gap-6">
      {(showFeegrantButton || showAuthzButton) && (
        <div className="flex gap-6">
          {showFeegrantButton && <FeegrantButton />}
          {showAuthzButton && <AuthzButton />}
        </div>
      )}
      {connected ? <SelectNetwork message={message} /> : null}
      {connected ? <Profile /> : <ConnectWalletButton />}
    </div>
  );
};

export default TopNav;
