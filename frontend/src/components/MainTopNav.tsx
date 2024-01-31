import React from 'react';
import AuthzButton from './AuthzButton';
import FeegrantButton from './FeegrantButton';

const MainTopNav = ({ title }: { title: string }) => {
  return (
    <div className="flex justify-between w-full items-center ">
      <h2 className="text-xl not-italic font-normal leading-[normal]">
        {title}
      </h2>
      <div className="flex gap-6">
        <FeegrantButton />
        <AuthzButton />
      </div>
    </div>
  );
};

export default MainTopNav;
