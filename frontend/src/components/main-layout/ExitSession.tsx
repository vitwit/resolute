import Image from 'next/image';
import React from 'react';

const ExitSession = () => {
  return (
    <div className="fixed-bottom w-full">
      <button className="flex gap-2 h-10 items-center pl-3 pr-6 w-full font-medium rounded-full hover:bg-[#FFFFFF0A]">
        <Image
          src="sidebar-menu-icons/logout-icon.svg"
          height={20}
          width={20}
          alt="Dashboard"
        />
        <div className="text-white text-[16px] leading-[19px]">
          Exit Session
        </div>
      </button>
    </div>
  );
};

export default ExitSession;
