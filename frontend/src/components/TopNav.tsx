import Profile from '@/app/(routes)/(overview)/overview-components/Profile';
import React from 'react';
import SelectNetwork from './SelectNetwork';

const TopNav = ({ message }: { message?: string }) => {
  return (
    <div className="flex justify-between gap-6">
      <SelectNetwork message={message} />
      <Profile />
    </div>
  );
};

export default TopNav;
