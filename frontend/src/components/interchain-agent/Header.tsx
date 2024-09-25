import Image from 'next/image';
import React from 'react';

interface HeaderProps {
  username?: string;
  logo?: string;
}

const VITWIT_LOGO = '/interchain-agent-logo-vitwit.svg';

const Header = ({ logo = VITWIT_LOGO, username = 'User' }: HeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Image src={logo} height={60} width={60} alt="" draggable={false} />
      <div className="flex flex-col items-center gap-2 font-thin">
        <div>Hi, {username}</div>
        <div className="text-[#ffffff80] text-[40px]">
          Can I help you with something?
        </div>
      </div>
    </div>
  );
};

export default Header;
