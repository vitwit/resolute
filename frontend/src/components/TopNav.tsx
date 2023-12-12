import Profile from '@/app/(routes)/(overview)/overview-components/Profile';
import React from 'react';
import SelectNetwork from './SelectNetwork';

const TopNav = () => {
  return (
    <div className="flex justify-between gap-6">
      <SelectNetwork />
      <Profile />
    </div>
  );
};

export default TopNav;
