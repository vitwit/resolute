import Profile from '@/app/(routes)/(overview)/overview-components/Profile';
import React from 'react';
import SelectNetwork from './SelectNetwork';
import AuthzButton from './AuthzButton';

const TopNav = ({
  message,
  showAuthzButton,
}: {
  message?: string;
  showAuthzButton?: boolean;
}) => {
  return (
    <div className="flex justify-between gap-6">
      {showAuthzButton && <AuthzButton />}
      <SelectNetwork message={message} />
      <Profile />
    </div>
  );
};

export default TopNav;
