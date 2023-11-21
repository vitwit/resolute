import React from 'react';
import './style.css';
import Image from 'next/image';

const TopNav = () => {
  return (
    <div className="main">
      <div className="topnav-gov">
        <div className="proposal-text-medium">Governance </div>
        <div className="flex space-x-6">
          <div className="flex space-x-6">
            <Image
              src="./history-icon.svg"
              height={40}
              width={40}
              alt="History-Icon"
              className="cursor-pointter"
            />
            <Image
              src="./logout-icon.svg"
              height={40}
              width={40}
              alt="Logout-Icon"
              className="cursor-pointter"
            />
          </div>
          <div className="flex space-x-1">
            <Image
              src="./cosmos-logo.svg"
              width={32}
              height={32}
              alt="Cosmos-Logo"
            />
            <p className="proposal-text-medium">Cosmos</p>
            <Image
              src="./copy-icon.svg"
              width={24}
              height={24}
              alt="Copy-Logo"
              className="cursor-pointer"
            />
            <div className="flex space-x-4">
              <Image
                src="./dropdown-icon.svg"
                width={16}
                height={16}
                alt="Dropdown"
                className="cursor-pointer"
              ></Image>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopNav;
