import Image from 'next/image';
import React from 'react';

const ExitSession = () => {
  return (
    <div>
      <div className="flex gap-2 h-10 items-center px-6">
        <Image
          src="sidebar-menu-icons/logout-icon.svg"
          height={24}
          width={24}
          alt="Dashboard"
        />
        <div className="text-white text-[16px] leading-[19px]">
          Exit Session
        </div>
      </div>
    </div>
  );
};

export default ExitSession;
