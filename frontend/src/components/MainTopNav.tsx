import React from 'react';

const MainTopNav = ({ title }: { title: string }) => {
  return (
    <div className="flex justify-between w-full items-center">
      <h2 className="text-white text-xl font-medium">{title}</h2>
    </div>
  );
};

export default MainTopNav;
