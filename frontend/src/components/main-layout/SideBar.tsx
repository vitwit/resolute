'use client';

import React from 'react';
import ExitSession from './ExitSession';
import SideMenu from './SideMenu';
import SelectNetwork from './SelectNetwork';
import ConnectWallet from './ConnectWallet';
import DialogSelectNetwork from './DialogSelectNetwork';

const SideBar = () => {
  return (
    <section className="sidebar">
      <SelectNetwork />
      <SideMenu />
      <ExitSession />
      <ConnectWallet />
      <DialogSelectNetwork />
    </section>
  );
};

export default SideBar;
