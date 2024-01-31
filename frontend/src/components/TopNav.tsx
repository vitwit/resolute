import Profile from '@/app/(routes)/(overview)/overview-components/Profile';
import React from 'react';
import SelectNetwork from './SelectNetwork';
import AuthzButton from './AuthzButton';
import FeegrantButton from './FeegrantButton';

const TopNav = ({
  message,
  showAuthzButton,
  showFeegrantButton,
}: {
  message?: string;
  showAuthzButton?: boolean;
  showFeegrantButton?: boolean;
}) => {
  return (
    <div className="flex justify-between gap-6">
      {(showFeegrantButton || showAuthzButton) && (
        <div className="flex gap-6">
          {showFeegrantButton && <FeegrantButton />}
          {showAuthzButton && <AuthzButton />}
        </div>
      )}
      <SelectNetwork message={message} />
      <Profile />
    </div>
  );
};

export default TopNav;
