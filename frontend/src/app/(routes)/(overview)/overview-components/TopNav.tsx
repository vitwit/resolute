import AuthzButton from '@/components/AuthzButton';
import React from 'react';

const TopNav = () => {
  return (
    <div className="flex py-2 justify-between w-full items-center">
      <h2 className="text-xl not-italic font-normal leading-[normal]">
        Overview
      </h2>
      <AuthzButton />
    </div>
  );
};

export default TopNav;
