import React from 'react';
import Image from 'next/image';

const Network = () => {
  return (
    <div className="right-view-grid">
      <div className="flex space-x-2">
        <Image src="/network.svg" width={24} height={24} alt="Network-ICon" />
        <p className="text-b1 items-center flex">Network</p>
      </div>
      <div className="divider-line"></div>
      <div className="pl-2 pr-6 py-2.5 flex space-x-2">
        <p className="text-b1">cosmo827dhjf...jk8df838j0</p>
        <Image src="/copy.svg" width={24} height={24} alt="copy-icon" />
      </div>
      <div className="network-bg w-full justify-between">
        <p className="text-[12px]">cosmoshub-4</p>
        <p className="text-small-light">Network ID</p>
      </div>
    </div>
  );
};

export default Network;
