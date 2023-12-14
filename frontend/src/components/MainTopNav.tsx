import React from 'react';

const MainTopNav = ({ title }: { title: string }) => {
  return (
    <div className="flex py-2 justify-between w-full items-center">
      <h2 className="text-xl not-italic font-normal leading-[normal]">{title}</h2>
    </div>
  );
};

export default MainTopNav;
