import AuthzButton from '@/components/AuthzButton';
import FeegrantButton from '@/components/FeegrantButton';
import React from 'react';

const TopNav = () => {
  return (
    <div className="flex justify-between w-full items-center">
      <h2 className="text-xl not-italic font-normal leading-[normal]">
        Overview
      </h2>
      <div className="flex gap-6">
        <FeegrantButton />
        <AuthzButton />
      </div>
    </div>
  );
};

export default TopNav;
