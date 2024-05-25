'use client';

import React from 'react';
import ExitSession from './ExitSession';
import SideMenu from './SideMenu';
import SelectNetwork from './SelectNetwork';
import ConnectWallet from './ConnectWallet';

const SideBar = () => {
  return (
    <section className="sidebar">
      <SelectNetwork />
      <SideMenu />
      <ExitSession />
      <ConnectWallet />
    </section>
  );
};

export default SideBar;
